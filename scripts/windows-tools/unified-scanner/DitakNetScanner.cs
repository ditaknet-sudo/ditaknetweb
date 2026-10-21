using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DitakNetScanner
{
    public class DeviceInfo
    {
        public string IP { get; set; }
        public string MAC { get; set; }
        public string Vendor { get; set; }
        public string Hostname { get; set; }
        public long LatencyMs { get; set; }
        public List<int> OpenPorts { get; set; }
        public string DeviceType { get; set; }
        public string InterfaceName { get; set; }

        public DeviceInfo()
        {
            OpenPorts = new List<int>();
            DeviceType = "Host / PC";
            Vendor = "Unknown";
            Hostname = "N/A";
            MAC = "Unknown";
        }
    }

    public class SubnetSpec
    {
        public string InterfaceName { get; set; }
        public IPAddress LocalIP { get; set; }
        public IPAddress Mask { get; set; }
        public int Cidr { get; set; }
        public IPAddress Gateway { get; set; }
        public List<IPAddress> TargetIPs { get; set; }

        public SubnetSpec()
        {
            TargetIPs = new List<IPAddress>();
        }
    }

    public class Program
    {
        [DllImport("iphlpapi.dll", ExactSpelling = true)]
        public static extern int SendARP(int destIP, int srcIP, byte[] pMacAddr, ref uint physAddrLen);

        private static readonly Dictionary<string, string> OuiVendors = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "AC-15-A2", "ZTE Corporation" },
            { "BC-38-98", "Apple Inc." },
            { "40-C7-3C", "Apple Inc." },
            { "98-FE-3E", "Huawei Technologies" },
            { "9C-65-EB", "Xiaomi Communications" },
            { "9C-C7-D3", "Samsung Electronics" },
            { "D8-07-B6", "MikroTik" },
            { "48-8F-5A", "MikroTik" },
            { "B8-69-F4", "MikroTik" },
            { "6C-3B-6B", "MikroTik" },
            { "18-FD-74", "MikroTik" },
            { "E0-C3-F3", "ZTE Corporation" },
            { "90-48-9A", "ZTE Corporation" },
            { "58-41-20", "ZTE Corporation" },
            { "28-6C-07", "Xiaomi Communications" },
            { "74-A7-8E", "Xiaomi Communications" },
            { "64-CC-2E", "Xiaomi Communications" },
            { "AC-C1-EE", "Xiaomi Communications" },
            { "34-CE-00", "Xiaomi Communications" },
            { "40-9B-CD", "Xiaomi Communications" },
            { "00-1A-2B", "Ubiquiti Networks" },
            { "F0-9F-C2", "Ubiquiti Networks" },
            { "B4-FB-E4", "Ubiquiti Networks" },
            { "04-18-D6", "Ubiquiti Networks" },
            { "24-A4-3C", "Ubiquiti Networks" },
            { "78-8A-20", "Ubiquiti Networks" },
            { "00-11-32", "Synology NAS" },
            { "00-0C-29", "VMware Virtual" },
            { "00-50-56", "VMware Virtual" },
            { "00-15-5D", "Microsoft Hyper-V" },
            { "E0-50-8B", "Dahua Technology" },
            { "4C-11-BF", "Dahua Technology" },
            { "9C-8E-CD", "Dahua Technology" },
            { "44-19-B6", "Hikvision CCTV" },
            { "BC-54-51", "Hikvision CCTV" },
            { "C0-56-E3", "Hikvision CCTV" },
            { "00-E0-4C", "Realtek Semiconductor" },
            { "54-EE-75", "Realtek Semiconductor" },
            { "B4-2E-99", "TP-Link" },
            { "3C-7C-3F", "TP-Link" },
            { "8C-16-45", "TP-Link" },
            { "50-C7-BF", "TP-Link" },
            { "F4-F5-D8", "Apple" },
            { "E4-AA-EA", "Apple" },
            { "AC-84-C6", "Apple" },
            { "A4-83-E7", "Apple" },
            { "1C-57-DC", "Samsung" },
            { "30-07-4D", "Samsung" },
            { "44-85-00", "Samsung" },
            { "00-E0-FC", "Huawei Technologies" },
            { "D4-6E-5C", "Huawei Technologies" },
            { "F8-3D-FF", "Huawei Technologies" },
            { "00-00-0C", "Cisco Systems" },
            { "00-1E-13", "Cisco Systems" },
            { "00-09-0F", "Fortinet" },
            { "B0-6E-BF", "Intel Corporate" },
            { "80-86-F2", "Intel Corporate" },
            { "00-1B-21", "Intel Corporate" },
            { "00-24-D7", "Intel Corporate" }
        };

        private static readonly int[] ProbedPorts = new int[] { 80, 443, 22, 554, 8291, 3389, 445, 5834, 8080 };

        public static void Main(string[] args)
        {
            bool autoExit = false;
            foreach (var arg in args)
            {
                if (arg.Equals("--auto", StringComparison.OrdinalIgnoreCase) || arg.Equals("-y", StringComparison.OrdinalIgnoreCase))
                {
                    autoExit = true;
                }
            }
            try { if (Console.IsInputRedirected) autoExit = true; } catch { }

            try { Console.OutputEncoding = Encoding.UTF8; } catch { }
            try { Console.Title = "DitakNet Fast LAN & Multi-Mask Scanner v2.0 - Standalone Windows"; } catch { }

            PrintBanner();

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("[*] Auto-detecting active network adapters and IP subnet masks...");
            Console.ResetColor();

            List<SubnetSpec> subnets = DiscoverSubnets();
            if (subnets.Count == 0)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[-] No active IPv4 network interfaces found.");
                Console.ResetColor();
                PauseAndExit(autoExit);
                return;
            }

            foreach (var sub in subnets)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.Write("  -> Adapter: ");
                Console.ForegroundColor = ConsoleColor.White;
                Console.Write("{0,-18} ", sub.InterfaceName);
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.Write("IP: {0}/{1} ", sub.LocalIP, sub.Cidr);
                Console.ForegroundColor = ConsoleColor.DarkGray;
                Console.Write("(Mask: {0}) ", sub.Mask);
                if (sub.Gateway != null)
                {
                    Console.ForegroundColor = ConsoleColor.Magenta;
                    Console.Write("Gateway: {0}", sub.Gateway);
                }
                Console.WriteLine();
                Console.ResetColor();
            }

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Cyan;
            int totalIPs = 0;
            foreach (var s in subnets) totalIPs += s.TargetIPs.Count;
            Console.WriteLine("[*] Launching high-speed parallel scan across {0} IP targets (multi-threaded async)...", totalIPs);
            Console.ResetColor();

            Stopwatch sw = Stopwatch.StartNew();

            ConcurrentBag<DeviceInfo> discovered = new ConcurrentBag<DeviceInfo>();
            ScanAllSubnets(subnets, discovered);

            sw.Stop();
            double durationSec = sw.Elapsed.TotalSeconds;

            List<DeviceInfo> sortedDevices = new List<DeviceInfo>(discovered);
            sortedDevices.Sort((a, b) => CompareIPs(a.IP, b.IP));

            // Print summary table
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("========================================================================================================");
            Console.WriteLine(" DISCOVERED ACTIVE DEVICES ({0} Found in {1:0.2}s)", sortedDevices.Count, durationSec);
            Console.WriteLine("========================================================================================================");
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            Console.WriteLine("{0,-16} {1,-18} {2,-24} {3,-18} {4,-12} {5,-14}", "IP Address", "MAC Address", "Hardware Vendor", "Device Hostname", "Type", "Open Ports");
            Console.ForegroundColor = ConsoleColor.DarkGray;
            Console.WriteLine(new string('-', 104));
            Console.ResetColor();

            foreach (var dev in sortedDevices)
            {
                Console.ForegroundColor = ConsoleColor.White;
                Console.Write("{0,-16} ", dev.IP);

                Console.ForegroundColor = ConsoleColor.Green;
                Console.Write("{0,-18} ", dev.MAC);

                Console.ForegroundColor = ConsoleColor.Cyan;
                string v = dev.Vendor.Length > 23 ? dev.Vendor.Substring(0, 23) : dev.Vendor;
                Console.Write("{0,-24} ", v);

                Console.ForegroundColor = ConsoleColor.Yellow;
                string h = dev.Hostname.Length > 17 ? dev.Hostname.Substring(0, 17) : dev.Hostname;
                Console.Write("{0,-18} ", h);

                Console.ForegroundColor = ConsoleColor.Magenta;
                Console.Write("{0,-12} ", dev.DeviceType);

                Console.ForegroundColor = ConsoleColor.Green;
                string ports = dev.OpenPorts.Count > 0 ? string.Join(",", dev.OpenPorts) : "None";
                Console.Write("{0,-14}", ports);

                Console.WriteLine();
                Console.ResetColor();
            }

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("========================================================================================================");
            Console.ResetColor();

            // Export HTML & CSV reports
            string htmlPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DitakNet-Scan-Report.html");
            string csvPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DitakNet-Scan-Report.csv");

            ExportHtmlReport(htmlPath, sortedDevices, subnets, durationSec);
            ExportCsvReport(csvPath, sortedDevices);

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("[✓] HTML Report generated: {0}", htmlPath);
            Console.WriteLine("[✓] CSV Report generated:  {0}", csvPath);
            Console.ResetColor();

            // Open HTML in default browser automatically only if interactive
            if (!autoExit)
            {
                try
                {
                    if (!Console.IsInputRedirected)
                    {
                        Process.Start(new ProcessStartInfo
                        {
                            FileName = htmlPath,
                            UseShellExecute = true
                        });
                    }
                }
                catch { }
            }

            PauseAndExit(autoExit);
        }

        static void PrintBanner()
        {
            try { Console.Clear(); } catch { }
            try { Console.ForegroundColor = ConsoleColor.Cyan; } catch { }
            Console.WriteLine(@"  ____  _ _        _    _   _      _   ");
            Console.WriteLine(@" |  _ \(_) |_ __ _| | _| \ | | ___| |_ ");
            Console.WriteLine(@" | | | | | __/ _` | |/ /  \| |/ _ \ __|");
            Console.WriteLine(@" | |_| | | || (_| |   <| |\  |  __/ |_ ");
            Console.WriteLine(@" |____/|_|\__\__,_|_|\_\_| \_|\___|\__|");
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(" DitakNet Fast LAN & Multi-Mask Scanner v2.0 - Standalone Windows");
            Console.ForegroundColor = ConsoleColor.DarkGray;
            Console.WriteLine(" Auto Subnet Detection (/24, /20, /16) | Zero Config | Instant ARP + Port Sweep");
            Console.WriteLine("================================================================================");
            Console.WriteLine();
            Console.ResetColor();
        }

        static List<SubnetSpec> DiscoverSubnets()
        {
            List<SubnetSpec> list = new List<SubnetSpec>();

            try
            {
                NetworkInterface[] interfaces = NetworkInterface.GetAllNetworkInterfaces();
                foreach (NetworkInterface ni in interfaces)
                {
                    if (ni.OperationalStatus != OperationalStatus.Up) continue;
                    if (ni.NetworkInterfaceType == NetworkInterfaceType.Loopback) continue;

                    IPInterfaceProperties ipProps = ni.GetIPProperties();
                    if (ipProps == null) continue;

                    IPAddress gateway = null;
                    if (ipProps.GatewayAddresses != null && ipProps.GatewayAddresses.Count > 0)
                    {
                        foreach (var g in ipProps.GatewayAddresses)
                        {
                            if (g.Address.AddressFamily == AddressFamily.InterNetwork && !g.Address.Equals(IPAddress.Any))
                            {
                                gateway = g.Address;
                                break;
                            }
                        }
                    }

                    foreach (UnicastIPAddressInformation u in ipProps.UnicastAddresses)
                    {
                        if (u.Address.AddressFamily == AddressFamily.InterNetwork)
                        {
                            string ipStr = u.Address.ToString();
                            if (ipStr.StartsWith("127.") || ipStr.StartsWith("169.254.")) continue;

                            IPAddress mask = u.IPv4Mask ?? IPAddress.Parse("255.255.255.0");
                            int cidr = GetCidr(mask);

                            SubnetSpec spec = new SubnetSpec
                            {
                                InterfaceName = ni.Name,
                                LocalIP = u.Address,
                                Mask = mask,
                                Cidr = cidr,
                                Gateway = gateway
                            };

                            GenerateTargetIPs(spec);
                            list.Add(spec);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error detecting interfaces: " + ex.Message);
            }

            return list;
        }

        static int GetCidr(IPAddress mask)
        {
            byte[] bytes = mask.GetAddressBytes();
            int cidr = 0;
            foreach (byte b in bytes)
            {
                byte temp = b;
                while (temp > 0)
                {
                    cidr += (temp & 1);
                    temp >>= 1;
                }
            }
            return cidr;
        }

        static void GenerateTargetIPs(SubnetSpec spec)
        {
            byte[] ipBytes = spec.LocalIP.GetAddressBytes();
            byte[] maskBytes = spec.Mask.GetAddressBytes();

            // For /24 or smaller (e.g. /24, /25, /26)
            if (spec.Cidr >= 24)
            {
                byte[] networkBytes = new byte[4];
                for (int i = 0; i < 4; i++) networkBytes[i] = (byte)(ipBytes[i] & maskBytes[i]);

                // Scan 1..254
                for (int i = 1; i <= 254; i++)
                {
                    byte[] target = new byte[] { networkBytes[0], networkBytes[1], networkBytes[2], (byte)i };
                    spec.TargetIPs.Add(new IPAddress(target));
                }
            }
            else
            {
                // For /20, /16 etc., scan the immediate /24 subnet slice of the local IP
                // plus the default gateway and known network endpoints to keep execution rapid (<2 sec)
                byte base0 = ipBytes[0];
                byte base1 = ipBytes[1];
                byte base2 = ipBytes[2];

                for (int i = 1; i <= 254; i++)
                {
                    spec.TargetIPs.Add(new IPAddress(new byte[] { base0, base1, base2, (byte)i }));
                }

                if (spec.Gateway != null && !spec.TargetIPs.Contains(spec.Gateway))
                {
                    spec.TargetIPs.Add(spec.Gateway);
                }
            }
        }

        static void ScanAllSubnets(List<SubnetSpec> subnets, ConcurrentBag<DeviceInfo> discovered)
        {
            // First: Gather existing OS ARP entries so we don't miss any quiet hosts
            Dictionary<string, string> arpCache = GetSystemArpCache();

            List<IPAddress> allTargets = new List<IPAddress>();
            HashSet<string> seen = new HashSet<string>();

            // Include system ARP entries that match active subnets
            foreach (var kvp in arpCache)
            {
                IPAddress ip;
                if (IPAddress.TryParse(kvp.Key, out ip))
                {
                    string ipStr = ip.ToString();
                    if (ipStr.StartsWith("224.") || ipStr.StartsWith("239.") || ipStr.EndsWith(".255") || ipStr == "255.255.255.255") continue;
                    if (kvp.Value == "FF:FF:FF:FF:FF:FF" || kvp.Value.StartsWith("01:00:5E")) continue;
                    if (seen.Add(ipStr))
                    {
                        allTargets.Add(ip);
                    }
                }
            }

            foreach (var sub in subnets)
            {
                foreach (var ip in sub.TargetIPs)
                {
                    string ipStr = ip.ToString();
                    if (ipStr.EndsWith(".255") || ipStr.EndsWith(".0")) continue;
                    if (seen.Add(ipStr))
                    {
                        allTargets.Add(ip);
                    }
                }
            }

            // High-concurrency async ping
            using (SemaphoreSlim throttler = new SemaphoreSlim(120))
            {
                List<Task> tasks = new List<Task>();

                foreach (var ip in allTargets)
                {
                    tasks.Add(Task.Run(async () =>
                    {
                        await throttler.WaitAsync();
                        try
                        {
                            DeviceInfo dev = await ProbeHostAsync(ip, subnets, arpCache);
                            if (dev != null)
                            {
                                discovered.Add(dev);
                            }
                        }
                        catch { }
                        finally
                        {
                            throttler.Release();
                        }
                    }));
                }

                Task.WaitAll(tasks.ToArray());
            }
        }

        static async Task<DeviceInfo> ProbeHostAsync(IPAddress ip, List<SubnetSpec> subnets, Dictionary<string, string> arpCache)
        {
            string ipStr = ip.ToString();
            if (ipStr.StartsWith("224.") || ipStr.StartsWith("239.") || ipStr.EndsWith(".255") || ipStr == "255.255.255.255") return null;
            long latency = -1;
            bool isAlive = false;
            string mac = null;

            // 1. Check if IP is in the system ARP table (instant memory lookup)
            if (arpCache.ContainsKey(ipStr))
            {
                mac = arpCache[ipStr];
                isAlive = true;
                latency = 1;
            }

            // 2. Check if this is the local machine's own IP
            if (!isAlive)
            {
                foreach (var sub in subnets)
                {
                    if (sub.LocalIP.Equals(ip))
                    {
                        isAlive = true;
                        mac = "LOCAL (This PC)";
                        latency = 0;
                        break;
                    }
                }
            }

            // 3. Fast ICMP Ping with 70ms timeout (never blocks kernel ARP)
            if (!isAlive)
            {
                try
                {
                    using (Ping ping = new Ping())
                    {
                        PingReply reply = await ping.SendPingAsync(ip, 70);
                        if (reply.Status == IPStatus.Success)
                        {
                            isAlive = true;
                            latency = reply.RoundtripTime;
                        }
                    }
                }
                catch { }
            }

            if (!isAlive) return null;

            // 4. Host is confirmed ALIVE, retrieve fresh MAC address via SendARP (takes 0.001 ms)
            if (string.IsNullOrEmpty(mac) || mac == "Unknown")
            {
                mac = GetMacAddress(ip);
            }
            if (string.IsNullOrEmpty(mac)) mac = "N/A (L3 Routed)";

            // Discover open ports in parallel ONLY for verified alive hosts
            List<int> openPorts = new List<int>();
            Parallel.ForEach(ProbedPorts, p =>
            {
                if (TestPort(ip, p, 100))
                {
                    lock (openPorts) { openPorts.Add(p); }
                }
            });
            openPorts.Sort();

            // Resolve Hostname with strict 80ms timeout
            string hostname = "N/A";
            try
            {
                var dnsTask = Dns.GetHostEntryAsync(ip);
                if (dnsTask.Wait(80))
                {
                    IPHostEntry entry = dnsTask.Result;
                    if (entry != null && !string.IsNullOrEmpty(entry.HostName))
                    {
                        hostname = entry.HostName;
                    }
                }
            }
            catch { }

            // Resolve Vendor
            string vendor = ResolveVendor(mac, hostname);

            // Determine Device Type
            string devType = DetermineDeviceType(ip, subnets, openPorts, vendor, hostname);

            return new DeviceInfo
            {
                IP = ipStr,
                MAC = mac,
                Vendor = vendor,
                Hostname = hostname,
                LatencyMs = latency >= 0 ? latency : 1,
                OpenPorts = openPorts,
                DeviceType = devType
            };
        }

        static bool TestPort(IPAddress ip, int port, int timeoutMs)
        {
            try
            {
                using (Socket sock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp))
                {
                    IAsyncResult ar = sock.BeginConnect(ip, port, null, null);
                    bool success = ar.AsyncWaitHandle.WaitOne(timeoutMs, false);
                    if (success)
                    {
                        sock.EndConnect(ar);
                        return true;
                    }
                }
            }
            catch { }
            return false;
        }

        static string GetMacAddress(IPAddress ip)
        {
            try
            {
                byte[] macBytes = new byte[6];
                uint length = (uint)macBytes.Length;
                byte[] ipBytes = ip.GetAddressBytes();
                int destIP = BitConverter.ToInt32(ipBytes, 0);

                int result = SendARP(destIP, 0, macBytes, ref length);
                if (result == 0 && length == 6)
                {
                    return string.Format("{0:X2}:{1:X2}:{2:X2}:{3:X2}:{4:X2}:{5:X2}",
                        macBytes[0], macBytes[1], macBytes[2], macBytes[3], macBytes[4], macBytes[5]);
                }
            }
            catch { }
            return null;
        }

        static Dictionary<string, string> GetSystemArpCache()
        {
            Dictionary<string, string> dict = new Dictionary<string, string>();
            try
            {
                ProcessStartInfo psi = new ProcessStartInfo("arp", "-a")
                {
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using (Process proc = Process.Start(psi))
                {
                    string output = proc.StandardOutput.ReadToEnd();
                    string[] lines = output.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (string line in lines)
                    {
                        string[] parts = line.Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries);
                        if (parts.Length >= 3 && parts[1].Contains("-"))
                        {
                            string ip = parts[0];
                            string mac = parts[1].Replace('-', ':').ToUpper();
                            dict[ip] = mac;
                        }
                    }
                }
            }
            catch { }
            return dict;
        }

        static string ResolveVendor(string mac, string hostname)
        {
            if (string.IsNullOrEmpty(mac) || mac == "Unknown" || mac.StartsWith("LOCAL"))
            {
                return "Local Computer";
            }

            string cleanMac = mac.Replace(":", "-").ToUpper();
            if (cleanMac.Length >= 8)
            {
                string prefix = cleanMac.Substring(0, 8);
                if (OuiVendors.ContainsKey(prefix))
                {
                    return OuiVendors[prefix];
                }
            }

            if (hostname.IndexOf("mikrotik", StringComparison.OrdinalIgnoreCase) >= 0) return "MikroTik";
            if (hostname.IndexOf("zte", StringComparison.OrdinalIgnoreCase) >= 0) return "ZTE Corporation";
            if (hostname.IndexOf("xiaomi", StringComparison.OrdinalIgnoreCase) >= 0 || hostname.IndexOf("redmi", StringComparison.OrdinalIgnoreCase) >= 0) return "Xiaomi";
            if (hostname.IndexOf("cisco", StringComparison.OrdinalIgnoreCase) >= 0) return "Cisco Systems";
            if (hostname.IndexOf("synology", StringComparison.OrdinalIgnoreCase) >= 0) return "Synology";

            return "Network Device";
        }

        static string DetermineDeviceType(IPAddress ip, List<SubnetSpec> subnets, List<int> openPorts, string vendor, string hostname)
        {
            foreach (var s in subnets)
            {
                if (s.Gateway != null && s.Gateway.Equals(ip)) return "Default Gateway";
                if (s.LocalIP.Equals(ip)) return "This Machine";
            }

            if (openPorts.Contains(554)) return "IP Camera / CCTV";
            if (openPorts.Contains(8291)) return "MikroTik Router";
            if (openPorts.Contains(3389)) return "Windows Server / RDP";
            if (openPorts.Contains(22) && (openPorts.Contains(80) || openPorts.Contains(443))) return "Server / Appliance";
            if (vendor.IndexOf("Xiaomi", StringComparison.OrdinalIgnoreCase) >= 0 || vendor.IndexOf("Apple", StringComparison.OrdinalIgnoreCase) >= 0 || vendor.IndexOf("Samsung", StringComparison.OrdinalIgnoreCase) >= 0) return "Mobile / Smart Device";
            if (vendor.IndexOf("MikroTik", StringComparison.OrdinalIgnoreCase) >= 0 || vendor.IndexOf("Cisco", StringComparison.OrdinalIgnoreCase) >= 0 || vendor.IndexOf("ZTE", StringComparison.OrdinalIgnoreCase) >= 0) return "Router / Switch";
            if (openPorts.Contains(80) || openPorts.Contains(443) || openPorts.Contains(8080)) return "Web Device / NAS";

            return "Network Host";
        }

        static int CompareIPs(string ipA, string ipB)
        {
            IPAddress a, b;
            if (IPAddress.TryParse(ipA, out a) && IPAddress.TryParse(ipB, out b))
            {
                byte[] bytesA = a.GetAddressBytes();
                byte[] bytesB = b.GetAddressBytes();
                for (int i = 0; i < 4; i++)
                {
                    if (bytesA[i] != bytesB[i]) return bytesA[i].CompareTo(bytesB[i]);
                }
            }
            return string.Compare(ipA, ipB, StringComparison.Ordinal);
        }

        static void ExportHtmlReport(string path, List<DeviceInfo> devices, List<SubnetSpec> subnets, double duration)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("<!DOCTYPE html>");
            sb.AppendLine("<html lang=\"hy\">");
            sb.AppendLine("<head>");
            sb.AppendLine("<meta charset=\"utf-8\">");
            sb.AppendLine("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
            sb.AppendLine("<title>DitakNet Network Scan Report</title>");
            sb.AppendLine("<style>");
            sb.AppendLine("body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif; background: #0c1015; color: #e6edf3; margin: 0; padding: 24px; }");
            sb.AppendLine(".container { max-width: 1200px; margin: 0 auto; }");
            sb.AppendLine(".header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #21262d; padding-bottom: 16px; margin-bottom: 24px; }");
            sb.AppendLine("h1 { margin: 0; font-size: 24px; color: #58a6ff; }");
            sb.AppendLine(".badge { background: #1f6feb22; border: 1px solid #1f6feb; color: #58a6ff; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: 600; }");
            sb.AppendLine(".grid-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }");
            sb.AppendLine(".card { background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; }");
            sb.AppendLine(".card-title { font-size: 12px; color: #8b949e; text-transform: uppercase; font-weight: bold; margin-bottom: 4px; }");
            sb.AppendLine(".card-val { font-size: 20px; font-weight: bold; color: #f0f6fc; }");
            sb.AppendLine("table { width: 100%; border-collapse: collapse; background: #161b22; border: 1px solid #30363d; border-radius: 8px; overflow: hidden; }");
            sb.AppendLine("th { background: #21262d; text-align: left; padding: 12px 16px; font-size: 12px; text-transform: uppercase; color: #8b949e; }");
            sb.AppendLine("td { padding: 12px 16px; border-bottom: 1px solid #21262d; font-size: 14px; }");
            sb.AppendLine("tr:hover td { background: #1c2128; }");
            sb.AppendLine(".tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }");
            sb.AppendLine(".tag-gw { background: #a371f722; color: #d2a8ff; border: 1px solid #a371f744; }");
            sb.AppendLine(".tag-cam { background: #f0883e22; color: #ffa657; border: 1px solid #f0883e44; }");
            sb.AppendLine(".tag-host { background: #23863622; color: #3fb950; border: 1px solid #23863644; }");
            sb.AppendLine(".port-pill { background: #388bfd22; color: #79c0ff; border-radius: 3px; padding: 1px 5px; font-size: 11px; margin-right: 4px; font-family: monospace; }");
            sb.AppendLine("</style>");
            sb.AppendLine("</head>");
            sb.AppendLine("<body>");
            sb.AppendLine("<div class=\"container\">");
            sb.AppendLine("  <div class=\"header\">");
            sb.AppendLine("    <div>");
            sb.AppendLine("      <h1>DitakNet Network Scan Report</h1>");
            sb.AppendLine("      <div style=\"color: #8b949e; font-size: 13px; margin-top: 4px;\">Generated: " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " | Scan duration: " + duration.ToString("0.2") + "s</div>");
            sb.AppendLine("    </div>");
            sb.AppendLine("    <div class=\"badge\">" + devices.Count + " Devices Active</div>");
            sb.AppendLine("  </div>");

            sb.AppendLine("  <div class=\"grid-info\">");
            sb.AppendLine("    <div class=\"card\"><div class=\"card-title\">Total Devices</div><div class=\"card-val\">" + devices.Count + "</div></div>");
            int gws = 0, cams = 0, webNas = 0;
            foreach (var d in devices)
            {
                if (d.DeviceType == "Default Gateway") gws++;
                if (d.DeviceType == "IP Camera / CCTV") cams++;
                if (d.OpenPorts.Contains(80) || d.OpenPorts.Contains(443)) webNas++;
            }
            sb.AppendLine("    <div class=\"card\"><div class=\"card-title\">Gateways / Routers</div><div class=\"card-val\">" + gws + "</div></div>");
            sb.AppendLine("    <div class=\"card\"><div class=\"card-title\">CCTV / Cameras</div><div class=\"card-val\">" + cams + "</div></div>");
            sb.AppendLine("    <div class=\"card\"><div class=\"card-title\">Web / NAS Services</div><div class=\"card-val\">" + webNas + "</div></div>");
            sb.AppendLine("  </div>");

            sb.AppendLine("  <table>");
            sb.AppendLine("    <thead>");
            sb.AppendLine("      <tr>");
            sb.AppendLine("        <th>IP Address</th>");
            sb.AppendLine("        <th>MAC Address</th>");
            sb.AppendLine("        <th>Hardware Vendor</th>");
            sb.AppendLine("        <th>Hostname</th>");
            sb.AppendLine("        <th>Device Type</th>");
            sb.AppendLine("        <th>Latency</th>");
            sb.AppendLine("        <th>Open Ports</th>");
            sb.AppendLine("      </tr>");
            sb.AppendLine("    </thead>");
            sb.AppendLine("    <tbody>");

            foreach (var d in devices)
            {
                string tagClass = "tag-host";
                if (d.DeviceType == "Default Gateway") tagClass = "tag-gw";
                else if (d.DeviceType == "IP Camera / CCTV") tagClass = "tag-cam";

                sb.AppendLine("      <tr>");
                sb.AppendLine("        <td><strong>" + d.IP + "</strong></td>");
                sb.AppendLine("        <td><code>" + d.MAC + "</code></td>");
                sb.AppendLine("        <td>" + d.Vendor + "</td>");
                sb.AppendLine("        <td>" + (d.Hostname == "N/A" ? "<span style='color:#6e7681'>N/A</span>" : d.Hostname) + "</td>");
                sb.AppendLine("        <td><span class=\"tag " + tagClass + "\">" + d.DeviceType + "</span></td>");
                sb.AppendLine("        <td>" + d.LatencyMs + " ms</td>");

                sb.Append("        <td>");
                if (d.OpenPorts.Count > 0)
                {
                    foreach (int p in d.OpenPorts) sb.Append("<span class=\"port-pill\">" + p + "</span>");
                }
                else
                {
                    sb.Append("<span style='color:#6e7681'>None</span>");
                }
                sb.AppendLine("</td>");
                sb.AppendLine("      </tr>");
            }

            sb.AppendLine("    </tbody>");
            sb.AppendLine("  </table>");
            sb.AppendLine("</div>");
            sb.AppendLine("</body>");
            sb.AppendLine("</html>");

            File.WriteAllText(path, sb.ToString(), Encoding.UTF8);
        }

        static void ExportCsvReport(string path, List<DeviceInfo> devices)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("IP,MAC,Vendor,Hostname,DeviceType,LatencyMs,OpenPorts");
            foreach (var d in devices)
            {
                string ports = string.Join(";", d.OpenPorts);
                sb.AppendLine(string.Format("\"{0}\",\"{1}\",\"{2}\",\"{3}\",\"{4}\",{5},\"{6}\"",
                    d.IP, d.MAC, d.Vendor, d.Hostname, d.DeviceType, d.LatencyMs, ports));
            }
            File.WriteAllText(path, sb.ToString(), Encoding.UTF8);
        }

        static void PauseAndExit(bool forceExit = false)
        {
            if (forceExit) return;
            try
            {
                if (!Console.IsInputRedirected && Environment.UserInteractive)
                {
                    Console.WriteLine();
                    Console.ForegroundColor = ConsoleColor.DarkGray;
                    Console.WriteLine("Press any key to close this window...");
                    Console.ResetColor();
                    Console.ReadKey();
                }
            }
            catch { }
        }
    }
}

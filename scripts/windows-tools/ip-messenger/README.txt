===============================================================================
       DitakNet Local IP Messenger - Standalone Windows Package & PWA
===============================================================================

DESCRIPTION:
  DitakNet Local IP Messenger allows instant, private, peer-to-peer communication
  between any two or more computers on the same Local Area Network (LAN).
  
  - No Internet connection required.
  - Zero cloud servers (Zero-Cloud privacy).
  - All chats and logs stored strictly on the local machine.
  - Simply enter the target device's IP (e.g. 192.168.1.50) to start chatting.

HOW TO RUN ON WINDOWS:
  1. Extract this ZIP archive to any folder.
  2. Double-click "DitakNet-IP-Messenger.bat".
     (If prompted, allow port 5834 through Windows Defender Firewall).
  3. The listener will activate on port 5834.
  4. Any other device on your network can send messages to your IP via:
     - The DitakNet Web PWA interface (http://<server-ip>:3000/tools/ip-messenger)
     - Or using the CLI: type "send <target-ip> <message>" right inside the console.

PWA WEB INTERFACE:
  - Open http://localhost:3000/hy/tools/ip-messenger in Chrome or Edge.
  - Click "Տեղադրել PWA Համակարգչում" (Install PWA) to run it as a native desktop app.
  - All messages are automatically saved in local browser storage (LocalStorage/IndexedDB).
  - Use the "Local Storage" button to backup/export your chats to JSON or wipe storage.

PORT & FIREWALL:
  Default Port: 5834 (TCP)
  Protocol: HTTP REST with CORS enabled for browser PWA access.

===============================================================================
DitakNet Local Monitoring & LAN Tools (c) 2026. All rights reserved.
===============================================================================

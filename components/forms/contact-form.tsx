"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FormError, FormSuccess, inputClassName } from "@/components/ui/form";
import { typedZodResolver } from "@/lib/form-resolver";
import { Locale, Messages, createTranslator } from "@/lib/i18n-core";
import { ContactInput, contactSchema, contactTopicValues } from "@/lib/validators";

export function ContactForm({ locale, messages }: { locale: Locale; messages: Messages }) {
  const t = createTranslator(messages);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactInput>({
    resolver: typedZodResolver<ContactInput>(contactSchema),
    defaultValues: { topic: "SUPPORT", locale }
  });

  async function onSubmit(values: ContactInput) {
    setServerError("");
    setSuccess("");
    const deploymentEnvironment = (document.getElementById("deployment-environment") as HTMLSelectElement | null)?.value?.trim();
    const deviceServerCount = (document.getElementById("device-server-count") as HTMLInputElement | null)?.value?.trim();
    const requiredPlan = (document.getElementById("required-plan") as HTMLSelectElement | null)?.value?.trim();
    const extraLines = [
      deploymentEnvironment ? `Deployment environment: ${deploymentEnvironment}` : "",
      deviceServerCount ? `Devices/servers (approx.): ${deviceServerCount}` : "",
      requiredPlan ? `Required annual plan: ${requiredPlan}` : ""
    ].filter(Boolean);
    const payload = {
      ...values,
      message: extraLines.length ? `${values.message}\n\n---\n${extraLines.join("\n")}` : values.message
    };
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setServerError(data.message || t("forms.errors.generic"));
      return;
    }

    setSuccess(data.message || t("contact.success"));
    reset({ topic: "SUPPORT", locale });
  }

  const error = (name: keyof ContactInput) => (errors[name] ? t("forms.errors.invalidField") : undefined);

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <FormError>{serverError}</FormError>
      <FormSuccess>{success}</FormSuccess>
      <p className="text-sm leading-6 text-[var(--muted)]">{t("contact.implementationHint")}</p>
      <input type="hidden" {...register("locale")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t("forms.fields.name")} error={error("name")}>
          <input className={inputClassName} autoComplete="name" {...register("name")} />
        </Field>
        <Field label={t("forms.fields.email")} error={error("email")}>
          <input className={inputClassName} type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label={t("forms.fields.phone")} error={error("phone")}>
          <input className={inputClassName} autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label={t("forms.fields.telegram")} error={error("telegram")}>
          <input className={inputClassName} {...register("telegram")} />
        </Field>
        <Field label={t("forms.fields.companyName")} error={error("companyName")}>
          <input className={inputClassName} {...register("companyName")} />
        </Field>
        <Field label={t("forms.fields.topic")} error={error("topic")}>
          <select className={inputClassName} {...register("topic")}>
            {contactTopicValues.map((value) => (
              <option key={value} value={value}>
                {t(`forms.contactTopics.${value}`)}
              </option>
            ))}
          </select>
        </Field>
        {/* Integration note: optional lead fields are appended to message until API schema is extended. */}
        <Field label={t("contact.deploymentEnvironment")}>
          <select id="deployment-environment" className={inputClassName} defaultValue="">
            <option value="">{t("contact.deploymentEnvironmentPlaceholder")}</option>
            <option value="Docker">{t("contact.deploymentEnvironments.DOCKER")}</option>
            <option value="Linux server">{t("contact.deploymentEnvironments.LINUX")}</option>
            <option value="TrueNAS SCALE">{t("contact.deploymentEnvironments.TRUENAS")}</option>
            <option value="Other / mixed">{t("contact.deploymentEnvironments.OTHER")}</option>
          </select>
        </Field>
        <Field label={t("contact.deviceServerCount")}>
          <input
            id="device-server-count"
            className={inputClassName}
            inputMode="numeric"
            placeholder={t("contact.deviceServerCountPlaceholder")}
          />
        </Field>
        <Field label={t("contact.requiredPlan")}>
          <select id="required-plan" className={inputClassName} defaultValue="">
            <option value="">{t("contact.requiredPlanPlaceholder")}</option>
            <option value="Lite">{t("contact.requiredPlans.LITE")}</option>
            <option value="Standard">{t("contact.requiredPlans.STANDARD")}</option>
            <option value="Pro">{t("contact.requiredPlans.PRO")}</option>
            <option value="Enterprise">{t("contact.requiredPlans.ENTERPRISE")}</option>
          </select>
        </Field>
      </div>
      <Field label={t("forms.fields.message")} error={error("message")}>
        <textarea className={inputClassName} rows={6} {...register("message")} />
      </Field>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t("forms.actions.saving") : t("contact.submit")}
      </Button>
    </form>
  );
}

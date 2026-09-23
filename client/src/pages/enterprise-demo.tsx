import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { enterpriseDemoSchema, buildEnterpriseDemoMailto } from "@shared/enterprise";

const organizationTypeOptions = [
  { value: "studio", label: "Studio" },
  { value: "label", label: "Label" },
  { value: "publisher", label: "Publisher" },
  { value: "production_company", label: "Production Company" },
  { value: "management", label: "Management" },
  { value: "distributor", label: "Distributor" },
  { value: "other", label: "Other" },
];

const teamSizeOptions = ["1-5", "6-10", "11-25", "26-50", "51-100", "100+"];

export default function EnterpriseDemoPage() {
  const [, setLocation] = useLocation();
  const form = useForm({
    resolver: zodResolver(enterpriseDemoSchema),
    defaultValues: {
      name: "",
      workEmail: "",
      company: "",
      organizationType: "studio",
      role: "",
      teamSize: "11-25",
      approximateOperators: "",
      approximateProjectsPerMonth: "",
      currentWorkflow: "",
      currentSystems: "",
      painPoint: "",
      securityRequirements: "",
      integrationRequirements: "",
      message: "",
    },
  });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (values: any) => {
    const href = buildEnterpriseDemoMailto(values);
    setSubmitted(true);
    window.location.href = href;
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Enterprise</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Request an Enterprise Demo</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Tell us about your organization, how you manage rights workflows today, and where you need more control.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input {...field} placeholder="Jane Smith" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="workEmail" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Work email</FormLabel>
                  <FormControl><Input {...field} type="email" placeholder="jane@company.com" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField name="company" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl><Input {...field} placeholder="Northlane Studio" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="organizationType" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizationTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField name="role" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl><Input {...field} placeholder="Operations Manager" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="teamSize" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Team size</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teamSizeOptions.map((value) => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField name="approximateOperators" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Approximate operators</FormLabel>
                  <FormControl><Input {...field} placeholder="12" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="approximateProjectsPerMonth" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Approximate projects/month</FormLabel>
                  <FormControl><Input {...field} placeholder="40" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField name="currentWorkflow" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Current workflow</FormLabel>
                <FormControl><Textarea {...field} rows={3} placeholder="Manual emails, spreadsheets, and project notes..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="currentSystems" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Current systems</FormLabel>
                <FormControl><Textarea {...field} rows={3} placeholder="Google Drive, email, project trackers, internal docs..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="painPoint" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Primary pain point</FormLabel>
                <FormControl><Textarea {...field} rows={3} placeholder="We need more reliable confirmation tracking and rights records..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="securityRequirements" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Security requirements</FormLabel>
                <FormControl><Textarea {...field} rows={2} placeholder="SSO, role mapping, audit access, security review..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="integrationRequirements" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Integration requirements</FormLabel>
                <FormControl><Textarea {...field} rows={2} placeholder="Google Workspace, Dropbox, FastDM, accounting or data sync..." /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField name="message" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl><Textarea {...field} rows={3} placeholder="Anything else you'd like us to know?" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setLocation("/billing")}>Back to Billing</Button>
              <Button type="submit" className="min-w-[180px]">
                {submitted ? "Opening email…" : "Request a Demo"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

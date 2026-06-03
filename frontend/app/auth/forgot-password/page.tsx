"use client";

import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { FormField } from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/lib/api/auth";
import { toast } from "@/lib/toast";
import { forgotPasswordFormSchema } from "@/lib/validation";

export default function ForgotPasswordPage(): React.ReactElement {
	const forgot = useForgotPassword();
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [sent, setSent] = useState(false);

	function handleSubmit(event: React.FormEvent): void {
		event.preventDefault();
		const parsed = forgotPasswordFormSchema.safeParse({ email });
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? "Enter a valid email");
			return;
		}
		setError("");
		forgot.mutate(parsed.data.email, {
			onSuccess: () => setSent(true),
			onError: (err) => toast.fromError(err),
		});
	}

	if (sent) {
		return (
			<div className="text-center">
				<span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700">
					<CheckCircle2Icon className="size-5" />
				</span>
				<h1 className="mt-5 font-heading font-semibold text-3xl tracking-tight">
					Check your email
				</h1>
				<p className="mt-3 text-muted-foreground text-sm sm:text-base">
					If an account exists for <span className="font-semibold text-foreground">{email}</span>,
					we&apos;ve sent a password reset code.
				</p>
				<Button size="xl" className="mt-8 w-full" render={<Link href="/auth/reset-password" />}>
					Enter reset code
				</Button>
				<Link href="/auth/login" className="mt-6 inline-flex font-semibold text-primary text-sm">
					Back to sign in
				</Link>
			</div>
		);
	}

	return (
		<div>
			<div className="space-y-3">
				<p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.18em]">
					Password reset
				</p>
				<h1 className="font-heading font-semibold text-3xl tracking-tight">
					Forgot password
				</h1>
				<p className="text-muted-foreground text-sm sm:text-base">
					Enter your email and we&apos;ll send you a code to reset it.
				</p>
			</div>

			<form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
				<FormField label="Email" htmlFor="email" error={error}>
					<Input
						id="email"
						type="email"
						autoComplete="email"
						placeholder="name@company.com"
						size="lg"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setError("");
						}}
						aria-invalid={Boolean(error)}
					/>
				</FormField>
				<Button type="submit" size="xl" className="w-full" loading={forgot.isPending}>
					Send reset code
				</Button>
			</form>

			<div className="mt-8 text-center text-muted-foreground text-sm">
				Remembered it?{" "}
				<Link href="/auth/login" className="font-semibold text-primary">
					Sign in
				</Link>
			</div>
		</div>
	);
}

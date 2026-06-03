"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { OTPField, OTPFieldInput } from "@/components/ui/otp-field";
import { useResendVerification, useVerifyEmail } from "@/lib/api/auth";
import { toast } from "@/lib/toast";

export default function VerifyEmailPage(): React.ReactElement {
	const router = useRouter();
	const { user, isLoading, isUnauthenticated } = useAuth();
	const verify = useVerifyEmail();
	const resend = useResendVerification();

	const [code, setCode] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (isUnauthenticated) router.replace("/auth/login");
		else if (user?.emailVerified) router.replace("/dashboard");
	}, [isUnauthenticated, user?.emailVerified, router]);

	function submit(value: string): void {
		if (!/^\d{6}$/.test(value)) {
			setError("Enter the 6-digit code");
			return;
		}
		setError("");
		verify.mutate(value, {
			onSuccess: () => {
				toast.success("Email verified", "Your account is now fully active.");
				router.replace("/dashboard");
			},
			onError: (err) => {
				setCode("");
				toast.fromError(err, "Verification failed");
			},
		});
	}

	return (
		<div>
			<div className="space-y-3">
				<p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.18em]">
					Email verification
				</p>
				<h1 className="font-heading font-semibold text-3xl tracking-tight">
					Verify your email
				</h1>
				<p className="text-muted-foreground text-sm sm:text-base">
					{isLoading || !user ? (
						"Enter the 6-digit code we sent you."
					) : (
						<>
							Enter the 6-digit code sent to{" "}
							<span className="font-semibold text-foreground">{user.email}</span>.
						</>
					)}
				</p>
			</div>

			<form
				className="mt-8 flex flex-col items-center gap-6"
				onSubmit={(e) => {
					e.preventDefault();
					submit(code);
				}}
			>
				<OTPField
					length={6}
					value={code}
					onValueChange={(value) => {
						setCode(value);
						setError("");
					}}
					onValueComplete={(value) => submit(value)}
					aria-invalid={Boolean(error)}
				>
					{Array.from({ length: 6 }, (_, i) => (
						<OTPFieldInput key={i} />
					))}
				</OTPField>
				{error && <p className="text-destructive text-xs">{error}</p>}

				<Button
					type="submit"
					size="xl"
					className="w-full"
					loading={verify.isPending}
					disabled={code.length !== 6}
				>
					Verify email
				</Button>
			</form>

			<div className="mt-8 flex flex-col items-center gap-2 text-center text-muted-foreground text-sm">
				<span>
					Didn&apos;t get a code?{" "}
					<button
						type="button"
						className="font-semibold text-primary disabled:opacity-64"
						disabled={resend.isPending}
						onClick={() =>
							resend.mutate(undefined, {
								onSuccess: () =>
									toast.success("Code sent", "Check your inbox for a new code."),
								onError: (err) => toast.fromError(err),
							})
						}
					>
						Resend
					</button>
				</span>
				<Link href="/dashboard" className="font-semibold text-primary">
					Skip for now
				</Link>
			</div>
		</div>
	);
}

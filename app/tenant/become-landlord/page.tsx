"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Building2,
    IdCard,
    MapPin,
    Receipt,
    Landmark,
    CreditCard,
    ChevronLeft,
    CheckCircle2,
    Upload,
    ImageIcon,
    X,
    ArrowRight,
    Loader2,
    FileText,
} from "lucide-react";
import TenantHeader from "../components/TenantHeader";

const steps = ["Personal Info", "Financial Details", "Review & Submit"];

interface FormData {
    government_id_file: File | null;
    profile_photo_file: File | null;
    physical_address: string;
    tax_id: string;
    bank_account: string;
    preferred_payment: string;
}

const initialForm: FormData = {
    government_id_file: null,
    profile_photo_file: null,
    physical_address: "",
    tax_id: "",
    bank_account: "",
    preferred_payment: "bank_transfer",
};

/* ── Reusable file drop zone ── */
function FileDropZone({
    label,
    hint,
    accept,
    icon: Icon,
    file,
    preview,
    onChange,
    onClear,
}: {
    label: string;
    hint: string;
    accept: string;
    icon: React.ElementType;
    file: File | null;
    preview?: string | null;
    onChange: (f: File) => void;
    onClear: () => void;
}) {
    const ref = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const handle = (files: FileList | null) => {
        if (files?.[0]) onChange(files[0]);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
                {label} <span className="text-red-500">*</span>
            </label>

            {file ? (
                <div className="relative flex items-center gap-3 bg-accent/5 border border-accent/30 rounded-xl px-4 py-3">
                    {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview} alt="preview" className="h-12 w-12 rounded-lg object-cover shrink-0 border border-border" />
                    ) : (
                        <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                            <FileText className="h-6 w-6 text-accent" />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClear}
                        className="shrink-0 h-7 w-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                    >
                        <X className="h-3.5 w-3.5 text-red-500" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => ref.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
                    className={`w-full flex flex-col items-center gap-2 border-2 border-dashed rounded-xl py-6 px-4 transition-colors cursor-pointer ${dragging
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50 hover:bg-accent/5"
                        }`}
                >
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                            Click or drag & drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-accent font-medium">
                        <Upload className="h-3.5 w-3.5" /> Browse files
                    </div>
                </button>
            )}

            <input
                ref={ref}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => handle(e.target.files)}
            />
        </div>
    );
}

export default function BecomeLandlordPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<FormData>(initialForm);
    const [govIdPreview, setGovIdPreview] = useState<string | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const setFile = (key: "government_id_file" | "profile_photo_file", setPreview: (s: string | null) => void) =>
        (file: File) => {
            setForm((f) => ({ ...f, [key]: file }));
            if (file.type.startsWith("image/")) {
                const url = URL.createObjectURL(file);
                setPreview(url);
            } else {
                setPreview(null);
            }
        };

    const clearFile = (key: "government_id_file" | "profile_photo_file", setPreview: (s: string | null) => void) => () => {
        setForm((f) => ({ ...f, [key]: null }));
        setPreview(null);
    };

    const setField = (key: keyof FormData) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async () => {
        setSubmitting(true);
        // TODO: wire up FormData multipart POST /api/landlord-applications
        await new Promise((r) => setTimeout(r, 1800));
        setSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div>
                <TenantHeader title="Become a Landlord" />
                <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-5 max-w-md"
                    >
                        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-bold text-foreground">Application Submitted!</h2>
                            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                Your landlord application is now under review. Our admin team typically responds within
                                1–3 business days. We&apos;ll notify you by email once a decision has been made.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/tenant")}
                            className="mt-2 flex items-center gap-2 bg-accent text-accent-foreground font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Back to Dashboard <ArrowRight className="h-4 w-4" />
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <TenantHeader title="Become a Landlord" subtitle="Fill in the details below to submit your application." />

            <div className="p-6 max-w-2xl mx-auto space-y-8">
                {/* Step Progress */}
                <div className="flex items-center gap-2">
                    {steps.map((label, i) => (
                        <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
                            <div
                                className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold shrink-0 transition-colors ${i < step
                                        ? "bg-accent text-accent-foreground"
                                        : i === step
                                            ? "bg-accent/15 text-accent border-2 border-accent"
                                            : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                            </div>
                            <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                                {label}
                            </span>
                            {i < steps.length - 1 && (
                                <div className={`flex-1 h-px mx-2 ${i < step ? "bg-accent" : "bg-border"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 0 – Personal Info */}
                {step === 0 && (
                    <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-card rounded-2xl p-6 space-y-5"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <IdCard className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-display font-semibold text-foreground">Personal Information</h3>
                                <p className="text-xs text-muted-foreground">Your identity &amp; address details</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Government ID — file upload */}
                            <FileDropZone
                                label="Government ID (Photo)"
                                hint="JPG, PNG or PDF — max 10 MB"
                                accept="image/*,.pdf"
                                icon={IdCard}
                                file={form.government_id_file}
                                preview={govIdPreview}
                                onChange={setFile("government_id_file", setGovIdPreview)}
                                onClear={clearFile("government_id_file", setGovIdPreview)}
                            />

                            {/* Physical Address */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Physical Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <textarea
                                        value={form.physical_address}
                                        onChange={setField("physical_address")}
                                        rows={3}
                                        placeholder="Street, City, Country"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Profile Photo — file upload */}
                            <FileDropZone
                                label="Profile Photo"
                                hint="JPG or PNG — max 5 MB. Used on your landlord profile card."
                                accept="image/*"
                                icon={ImageIcon}
                                file={form.profile_photo_file}
                                preview={photoPreview}
                                onChange={setFile("profile_photo_file", setPhotoPreview)}
                                onClear={clearFile("profile_photo_file", setPhotoPreview)}
                            />
                            <p className="text-xs text-muted-foreground -mt-2">Optional</p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                disabled={!form.government_id_file || !form.physical_address.trim()}
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 1 – Financial Details */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card rounded-2xl p-6 space-y-5"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Landmark className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-display font-semibold text-foreground">Financial Details</h3>
                                <p className="text-xs text-muted-foreground">Your tax and payment information</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Tax ID <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={form.tax_id}
                                        onChange={setField("tax_id")}
                                        placeholder="e.g. TIN-000-000-000"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Bank Account Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={form.bank_account}
                                        onChange={setField("bank_account")}
                                        placeholder="e.g. 0123456789"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Preferred Payment Method <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <select
                                        value={form.preferred_payment}
                                        onChange={setField("preferred_payment")}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 appearance-none"
                                    >
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="mobile_money">Mobile Money</option>
                                        <option value="check">Check</option>
                                        <option value="cash">Cash</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={() => setStep(0)}
                                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" /> Back
                            </button>
                            <button
                                disabled={!form.tax_id.trim() || !form.bank_account.trim()}
                                onClick={() => setStep(2)}
                                className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Review <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2 – Review & Submit */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="glass-card rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-display font-semibold text-foreground">Review Your Application</h3>
                                    <p className="text-xs text-muted-foreground">Make sure everything looks correct before submitting.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { label: "Government ID", value: form.government_id_file?.name ?? "—" },
                                    { label: "Physical Address", value: form.physical_address },
                                    { label: "Profile Photo", value: form.profile_photo_file?.name ?? "Not provided" },
                                    { label: "Tax ID", value: form.tax_id },
                                    { label: "Bank Account", value: form.bank_account },
                                    { label: "Preferred Payment", value: form.preferred_payment.replace("_", " ") },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-secondary/50 rounded-xl px-4 py-3">
                                        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                                        <p className="text-sm font-medium text-foreground truncate capitalize">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Photo preview if available */}
                            {photoPreview && (
                                <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={photoPreview} alt="Profile preview" className="h-14 w-14 rounded-xl object-cover border border-border" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Profile photo preview</p>
                                        <p className="text-sm font-medium text-foreground">{form.profile_photo_file?.name}</p>
                                    </div>
                                </div>
                            )}

                            {/* Disclaimer */}
                            <p className="text-xs text-muted-foreground bg-muted/60 rounded-xl px-4 py-3 leading-relaxed">
                                By submitting, you confirm that all provided information is accurate and agree to our
                                landlord terms of service. Your application will be reviewed by an admin within 1–3
                                business days.
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" /> Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm px-7 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                                    </>
                                ) : (
                                    <>
                                        Submit Application <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

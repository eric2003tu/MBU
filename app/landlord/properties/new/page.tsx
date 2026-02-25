"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Building2,
    MapPin,
    FileText,
    Home,
    Users,
    DollarSign,
    Plus,
    Trash2,
    ChevronLeft,
    CheckCircle2,
    ArrowRight,
    Loader2,
    Upload,
    ImageIcon,
    X,
    Layers,
} from "lucide-react";
import LandlordHeader from "../../components/LandlordHeader";

/* ═══════════════════════════════════════ */
/*  Types                                  */
/* ═══════════════════════════════════════ */

type PropertyType = "HOUSE" | "APARTMENT" | "ROOM" | "VILLA" | "STUDIO" | "COMMERCIAL" | "LAND" | "DUPLEX";
type RentalType = "DAILY" | "MONTHLY" | "YEARLY";

interface PricingPlan {
    rental_type: RentalType;
    price: string;
    minimum_stay: string;
}

interface UnitData {
    unit_name: string;
    max_guests: string;
    pricingPlans: PricingPlan[];
}

interface PropertyForm {
    title: string;
    property_type: PropertyType;
    address: string;
    city: string;
    description: string;
    images: File[];
    units: UnitData[];
}

const steps = ["Property Details", "Upload Images", "Add Units", "Review & Submit"];

const propertyTypes: PropertyType[] = ["HOUSE", "APARTMENT", "ROOM", "VILLA", "STUDIO", "COMMERCIAL", "LAND", "DUPLEX"];

const typeLabels: Record<PropertyType, string> = {
    HOUSE: "House",
    APARTMENT: "Apartment",
    ROOM: "Room",
    VILLA: "Villa",
    STUDIO: "Studio",
    COMMERCIAL: "Commercial",
    LAND: "Land",
    DUPLEX: "Duplex",
};

const rentalTypes: RentalType[] = ["DAILY", "MONTHLY", "YEARLY"];

const emptyPlan: PricingPlan = { rental_type: "MONTHLY", price: "", minimum_stay: "1" };

const emptyUnit: UnitData = {
    unit_name: "",
    max_guests: "2",
    pricingPlans: [{ ...emptyPlan }],
};

const initialForm: PropertyForm = {
    title: "",
    property_type: "APARTMENT",
    address: "",
    city: "",
    description: "",
    images: [],
    units: [{ ...emptyUnit, pricingPlans: [{ ...emptyPlan }] }],
};

/* ═══════════════════════════════════════ */
/*  Shared input classes                   */
/* ═══════════════════════════════════════ */
const inputCls =
    "w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40";
const inputPlainCls =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40";
const selectCls =
    "w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 appearance-none";

/* ═══════════════════════════════════════ */
/*  Page Component                         */
/* ═══════════════════════════════════════ */
export default function AddPropertyPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<PropertyForm>(initialForm);
    const [previews, setPreviews] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    /* ── helpers ── */
    const setField = <K extends keyof PropertyForm>(key: K, value: PropertyForm[K]) =>
        setForm((f) => ({ ...f, [key]: value }));

    const addImages = (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files);
        setForm((f) => ({ ...f, images: [...f.images, ...newFiles] }));
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreviews((p) => [...p, ...newPreviews]);
    };

    const removeImage = (idx: number) => {
        setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
        setPreviews((p) => p.filter((_, i) => i !== idx));
    };

    const addUnit = () =>
        setForm((f) => ({
            ...f,
            units: [...f.units, { ...emptyUnit, pricingPlans: [{ ...emptyPlan }] }],
        }));

    const removeUnit = (idx: number) =>
        setForm((f) => ({ ...f, units: f.units.filter((_, i) => i !== idx) }));

    const updateUnit = (idx: number, key: keyof UnitData, value: string) =>
        setForm((f) => ({
            ...f,
            units: f.units.map((u, i) => (i === idx ? { ...u, [key]: value } : u)),
        }));

    const addPlan = (unitIdx: number) =>
        setForm((f) => ({
            ...f,
            units: f.units.map((u, i) =>
                i === unitIdx ? { ...u, pricingPlans: [...u.pricingPlans, { ...emptyPlan }] } : u
            ),
        }));

    const removePlan = (unitIdx: number, planIdx: number) =>
        setForm((f) => ({
            ...f,
            units: f.units.map((u, i) =>
                i === unitIdx
                    ? { ...u, pricingPlans: u.pricingPlans.filter((_, pi) => pi !== planIdx) }
                    : u
            ),
        }));

    const updatePlan = (unitIdx: number, planIdx: number, key: keyof PricingPlan, value: string) =>
        setForm((f) => ({
            ...f,
            units: f.units.map((u, i) =>
                i === unitIdx
                    ? {
                        ...u,
                        pricingPlans: u.pricingPlans.map((p, pi) =>
                            pi === planIdx ? { ...p, [key]: value } : p
                        ),
                    }
                    : u
            ),
        }));

    const handleSubmit = async () => {
        setSubmitting(true);
        // TODO: POST to /api/properties
        await new Promise((r) => setTimeout(r, 1800));
        setSubmitting(false);
        setSubmitted(true);
    };

    /* ── step validation ── */
    const canNext0 = form.title.trim() && form.address.trim() && form.city.trim();
    const canNext2 = form.units.every(
        (u) => u.unit_name.trim() && u.pricingPlans.every((p) => Number(p.price) > 0)
    );

    /* ═══════════════════════════════════ */
    /*  SUCCESS SCREEN                     */
    /* ═══════════════════════════════════ */
    if (submitted) {
        return (
            <div>
                <LandlordHeader title="Add Property" />
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
                            <h2 className="text-2xl font-display font-bold text-foreground">Property Listed!</h2>
                            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                &quot;{form.title}&quot; has been successfully created with {form.units.length} unit
                                {form.units.length !== 1 ? "s" : ""}. You can manage it from your properties page.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/landlord/properties")}
                            className="mt-2 flex items-center gap-2 bg-accent text-accent-foreground font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                        >
                            View My Properties <ArrowRight className="h-4 w-4" />
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <LandlordHeader title="Add Property" subtitle="Create a new property listing with units and pricing." />

            <div className="p-6 mx-auto space-y-8">
                {/* ── Step Progress ── */}
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

                {/* ══════════════════════════════════════ */}
                {/*  STEP 0 – Property Details             */}
                {/* ══════════════════════════════════════ */}
                {step === 0 && (
                    <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card rounded-2xl p-6 space-y-5"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-display font-semibold text-foreground">Property Details</h3>
                                <p className="text-xs text-muted-foreground">Basic information about your property</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Property Title <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setField("title", e.target.value)}
                                        placeholder="e.g. Sunset Apartments"
                                        className={inputCls}
                                    />
                                </div>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Property Type <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <select
                                        value={form.property_type}
                                        onChange={(e) => setField("property_type", e.target.value as PropertyType)}
                                        className={selectCls}
                                    >
                                        {propertyTypes.map((t) => (
                                            <option key={t} value={t}>{typeLabels[t]}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Address & City */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={form.address}
                                            onChange={(e) => setField("address", e.target.value)}
                                            placeholder="e.g. KG 123 St"
                                            className={inputCls}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={form.city}
                                            onChange={(e) => setField("city", e.target.value)}
                                            placeholder="e.g. Kigali"
                                            className={inputCls}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setField("description", e.target.value)}
                                        rows={3}
                                        placeholder="Describe your property…"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                disabled={!canNext0}
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ══════════════════════════════════════ */}
                {/*  STEP 1 – Upload Images                */}
                {/* ══════════════════════════════════════ */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card rounded-2xl p-6 space-y-5"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-display font-semibold text-foreground">Property Images</h3>
                                <p className="text-xs text-muted-foreground">Upload photos of your property (optional but recommended)</p>
                            </div>
                        </div>

                        {/* Drop zone */}
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="w-full flex flex-col items-center gap-2 border-2 border-dashed rounded-xl py-8 px-4 transition-colors cursor-pointer border-border hover:border-accent/50 hover:bg-accent/5"
                        >
                            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                                <Upload className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-foreground">Click or drag & drop to upload</p>
                                <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG — max 10 MB per image</p>
                            </div>
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => addImages(e.target.files)}
                        />

                        {/* Preview grid */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {previews.map((src, idx) => (
                                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-border">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={src} alt={`Property image ${idx + 1}`} className="h-28 w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3.5 w-3.5 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={() => setStep(0)}
                                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" /> Back
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Next <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ══════════════════════════════════════ */}
                {/*  STEP 2 – Add Units & Pricing          */}
                {/* ══════════════════════════════════════ */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-5"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <Layers className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-display font-semibold text-foreground">Rental Units</h3>
                                    <p className="text-xs text-muted-foreground">Add units with guest capacity and pricing plans</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addUnit}
                                className="flex items-center gap-1.5 bg-accent/10 text-accent border border-accent/30 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-accent/20 transition-colors"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add Unit
                            </button>
                        </div>

                        {form.units.map((unit, uIdx) => (
                            <motion.div
                                key={uIdx}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: uIdx * 0.05 }}
                                className="glass-card rounded-2xl p-5 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-foreground">Unit {uIdx + 1}</h4>
                                    {form.units.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeUnit(uIdx)}
                                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">
                                            Unit Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={unit.unit_name}
                                            onChange={(e) => updateUnit(uIdx, "unit_name", e.target.value)}
                                            placeholder="e.g. Unit 1A – Ground Floor"
                                            className={inputPlainCls}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-foreground mb-1">
                                            Max Guests <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <input
                                                type="number"
                                                min={1}
                                                value={unit.max_guests}
                                                onChange={(e) => updateUnit(uIdx, "max_guests", e.target.value)}
                                                className={inputCls}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing plans */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-medium text-muted-foreground">Pricing Plans</p>
                                        <button
                                            type="button"
                                            onClick={() => addPlan(uIdx)}
                                            className="flex items-center gap-1 text-[11px] text-accent font-medium hover:underline"
                                        >
                                            <Plus className="h-3 w-3" /> Add plan
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {unit.pricingPlans.map((plan, pIdx) => (
                                            <div key={pIdx} className="flex flex-wrap items-end gap-3 bg-secondary/30 rounded-xl p-3">
                                                <div className="flex-1 min-w-[120px]">
                                                    <label className="block text-[10px] font-medium text-muted-foreground mb-1">Type</label>
                                                    <select
                                                        value={plan.rental_type}
                                                        onChange={(e) => updatePlan(uIdx, pIdx, "rental_type", e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 appearance-none"
                                                    >
                                                        {rentalTypes.map((rt) => (
                                                            <option key={rt} value={rt}>
                                                                {rt.charAt(0) + rt.slice(1).toLowerCase()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex-1 min-w-[100px]">
                                                    <label className="block text-[10px] font-medium text-muted-foreground mb-1">Price ($) *</label>
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={plan.price}
                                                            onChange={(e) => updatePlan(uIdx, pIdx, "price", e.target.value)}
                                                            placeholder="0"
                                                            className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-24">
                                                    <label className="block text-[10px] font-medium text-muted-foreground mb-1">Min Stay</label>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        value={plan.minimum_stay}
                                                        onChange={(e) => updatePlan(uIdx, pIdx, "minimum_stay", e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                                                    />
                                                </div>
                                                {unit.pricingPlans.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removePlan(uIdx, pIdx)}
                                                        className="h-8 w-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" /> Back
                            </button>
                            <button
                                disabled={!canNext2}
                                onClick={() => setStep(3)}
                                className="flex items-center gap-2 bg-accent text-accent-foreground font-semibold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Review <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ══════════════════════════════════════ */}
                {/*  STEP 3 – Review & Submit              */}
                {/* ══════════════════════════════════════ */}
                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Property overview */}
                        <div className="glass-card rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-display font-semibold text-foreground">Review Your Property</h3>
                                    <p className="text-xs text-muted-foreground">Make sure everything looks correct before listing.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    { label: "Title", value: form.title },
                                    { label: "Type", value: typeLabels[form.property_type] },
                                    { label: "Address", value: form.address },
                                    { label: "City", value: form.city },
                                    { label: "Images", value: `${form.images.length} photo${form.images.length !== 1 ? "s" : ""}` },
                                    { label: "Units", value: `${form.units.length} unit${form.units.length !== 1 ? "s" : ""}` },
                                ].map(({ label, value }) => (
                                    <div key={label} className="bg-secondary/50 rounded-xl px-4 py-3">
                                        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                                        <p className="text-sm font-medium text-foreground truncate capitalize">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {form.description && (
                                <div className="bg-secondary/50 rounded-xl px-4 py-3">
                                    <p className="text-xs text-muted-foreground mb-0.5">Description</p>
                                    <p className="text-sm text-foreground leading-relaxed">{form.description}</p>
                                </div>
                            )}

                            {/* Image previews */}
                            {previews.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {previews.map((src, i) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img key={i} src={src} alt={`Preview ${i + 1}`} className="h-20 w-28 rounded-xl object-cover border border-border shrink-0" />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Units summary */}
                        <div className="glass-card rounded-2xl p-6 space-y-4">
                            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                                <Layers className="h-5 w-5 text-accent" />
                                Units ({form.units.length})
                            </h3>
                            <div className="space-y-3">
                                {form.units.map((unit, i) => (
                                    <div key={i} className="bg-secondary/50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-semibold text-foreground">{unit.unit_name || `Unit ${i + 1}`}</p>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Users className="h-3 w-3" /> Max {unit.max_guests} guests
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {unit.pricingPlans.map((p, pi) => (
                                                <span key={pi} className="text-xs font-medium px-3 py-1.5 rounded-full bg-accent/10 text-accent">
                                                    ${p.price}/{p.rental_type === "DAILY" ? "night" : p.rental_type === "MONTHLY" ? "mo" : "yr"}
                                                    {Number(p.minimum_stay) > 1 && ` · min ${p.minimum_stay}`}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setStep(2)}
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
                                        <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                                    </>
                                ) : (
                                    <>
                                        Create Property <ArrowRight className="h-4 w-4" />
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

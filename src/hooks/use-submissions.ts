import { useSubmissionStore } from "@/store/submission-store";
import { useAuthStore } from "@/store/auth-store";
import { WalrusSubmissionPayload } from "@/types/submissions";
import { toast } from "sonner";

export function useSubmissions() {
  const { formId, answers, isSubmitting, setSubmitting, resetStore } =
    useSubmissionStore();

  // Destructure state dari auth-store lu dengan benar
  const { userAddress, authStatus } = useAuthStore();

  /**
   * Fungsi submitForm menerima argumen allowAnonymous dari komponen UI
   * (Diambil dari FormSettings.allowAnonymous saat merender public-form)
   */
  const submitForm = async (allowAnonymous: boolean = true) => {
    if (!formId) {
      toast.error("Terjadi kesalahan", {
        description: "Form ID tidak ditemukan.",
      });
      return;
    }

    // 1. Client-side Auth Validation
    if (!allowAnonymous && authStatus !== "authenticated") {
      toast.error("Akses Ditolak", {
        description:
          "Form ini mewajibkan kamu untuk connect wallet (Sui) terlebih dahulu.",
      });
      return;
    }

    if (authStatus === "checking" || authStatus === "authenticating") {
      toast.warning("Tunggu sebentar...", {
        description: "Sedang memverifikasi sesi wallet kamu.",
      });
      return;
    }

    setSubmitting(true);

    try {
      // 2. Rakit Payload sesuai standar immutable Walrus (versi 1.0)
      const payload: WalrusSubmissionPayload = {
        version: "1.0",
        formId,
        respondentAddress: userAddress, // Akan berisi '0x...' atau null sesuai auth
        answers,
        clientSubmittedAt: Date.now(),
      };

      // 3. Tembak ke Backend API Router
      const response = await fetch(`/api/forms/${formId}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengirimkan jawaban.");
      }

      const data = await response.json();

      // 4. Sukses feedback & reset
      toast.success("Berhasil!", {
        description: "Jawaban kamu telah terekam dengan aman.",
      });

      resetStore();
      return data; // Bakal bawa blobId dari backend
    } catch (error) {
      console.error("[Submission Error]:", error);
      toast.error("Gagal mengirim jawaban", {
        description:
          error instanceof Error ? error.message : "Coba beberapa saat lagi.",
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting,
  };
}

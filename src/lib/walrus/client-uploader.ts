import { useUploadStore } from "@/store/upload-store";

export const uploadToWalrusAPI = (file: File, taskId: string) => {
  const { updateProgress, setSuccess, setError } = useUploadStore.getState();

  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  formData.append("file", file);

  // 1. Pantau Progress Upload (Dari Browser ke Next.js API)
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percentComplete = Math.round((event.loaded / event.total) * 100);
      updateProgress(taskId, percentComplete);
    }
  };

  // 2. Pantau Selesai
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const response = JSON.parse(xhr.responseText);
        // Berhasil dapet Blob ID dari Walrus!
        setSuccess(taskId, response.blobId);
      } catch (err) {
        setError(taskId, "Invalid response from server.");
      }
    } else {
      setError(taskId, "Upload failed.");
    }
  };

  // 3. Pantau Error Jaringan
  xhr.onerror = () => {
    setError(taskId, "Network error occurred.");
  };

  xhr.open("POST", "/api/walrus", true);
  xhr.send(formData);
};

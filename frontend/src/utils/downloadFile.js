import api from "@/services/api/axiosInstance";
import API_ENDPOINTS from "@/constants/apiEndpoints";

// The backend's /api/files/download/{filename} endpoint requires a valid
// JWT, so we can't just point a browser at the URL directly — we fetch it
// as a blob (the axios interceptor attaches the Authorization header) and
// then trigger the browser's native download using a temporary object URL.
const downloadFile = async (storedFilename, downloadName) => {
  const response = await api.get(API_ENDPOINTS.FILE.DOWNLOAD(storedFilename), {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", downloadName || storedFilename);

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};

export default downloadFile;

import Swal from "sweetalert2";

const ACCENT = "#315f8a";

export const showAdminToast = (icon, title) =>
  Swal.fire({
    icon,
    title,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2600,
    timerProgressBar: true,
  });

export const showAdminError = (action, error) =>
  Swal.fire({
    icon: "error",
    title: `${action} gagal`,
    text: error?.message || "Terjadi kesalahan. Silakan coba lagi.",
    confirmButtonColor: ACCENT,
  });

export const confirmAdminDelete = (item) =>
  Swal.fire({
    icon: "warning",
    title: `Hapus ${item}?`,
    text: "Tindakan ini tidak dapat dibatalkan.",
    showCancelButton: true,
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: ACCENT,
    cancelButtonColor: "#64748b",
  }).then(({ isConfirmed }) => isConfirmed);

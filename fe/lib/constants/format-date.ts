export const formatDate = (dateString: string) => {
	if (!dateString) return "";
	const date = new Date(dateString);

	// Trả về định dạng dd/mm/yyyy theo chuẩn VN
	return date.toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};
// 비밀번호 변경 로직
document.getElementById("change-password").addEventListener("click", () => {
    const currentPassword = prompt("현재 비밀번호를 입력하세요:");
    if (currentPassword !== HOST_PASSWORD) {
      alert("비밀번호가 틀렸습니다.");
      return;
    }
  
    const newPassword = prompt("새 비밀번호를 입력하세요:");
    if (newPassword && newPassword.trim().length > 0) {
      window.updateHostPassword(newPassword.trim()); // 전역 함수 호출
      alert("비밀번호가 성공적으로 변경되었습니다.");
    } else {
      alert("유효한 비밀번호를 입력하세요.");
    }
});

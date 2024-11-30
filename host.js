let HOST_PASSWORD = "1234"; // 기본 비밀번호
let isHostLoggedIn = false; // 호스트 로그인 상태

// 호스트 비밀번호와 당첨 번호를 서버(로컬 스토리지)에 저장
function saveToServer(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadFromServer(key) {
  return JSON.parse(localStorage.getItem(key));
}

// 초기 데이터 로드
window.onload = () => {
  const storedPassword = loadFromServer("hostPassword");
  if (storedPassword) {
    HOST_PASSWORD = storedPassword;
  }

  const winningNumbers = loadFromServer("winningNumbers");
  if (winningNumbers) {
    document.getElementById("winning-numbers-public").textContent = winningNumbers.join(", ");
    toggleAddParticipantButton(false); // 당첨 번호가 있다면 참가자 추가 버튼 비활성화
  }
};

// 호스트 비밀번호 확인 함수
function verifyHostPassword() {
  const inputPassword = prompt("호스트 비밀번호를 입력하세요:");
  return inputPassword === HOST_PASSWORD;
}

// 참가자 추가 버튼 활성화/비활성화
function toggleAddParticipantButton(enable) {
  document.getElementById("add-participant").disabled = !enable;
}

// 호스트 로그인
document.getElementById("host-login-button").addEventListener("click", () => {
  const inputPassword = document.getElementById("host-password").value.trim();
  if (inputPassword === HOST_PASSWORD) {
    isHostLoggedIn = true;
    alert("호스트로 로그인되었습니다.");
    document.getElementById("host-functions").classList.remove("d-none"); // 호스트 기능 표시
    document.getElementById("host-login").classList.add("d-none"); // 로그인 폼 숨김
  } else {
    alert("비밀번호가 틀렸습니다.");
  }
});

// 호스트 기능 실행 전 비밀번호 확인
function requireHostPassword(callback) {
  if (verifyHostPassword()) {
    callback();
  } else {
    alert("비밀번호가 틀렸습니다.");
  }
}

// 참가자 추가
document.getElementById("add-participant").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const numbers = Array.from(document.querySelectorAll(".lotto-number")).map((input) =>
    parseInt(input.value, 10)
  );

  if (!name || numbers.some(isNaN) || numbers.length !== 6) {
    alert("올바른 이름과 6개의 번호를 입력해주세요.");
    return;
  }

  let participants = JSON.parse(localStorage.getItem("participants") || "[]");

  if (participants.some((p) => p.name === name)) {
    alert("이미 동일한 이름의 참가자가 존재합니다.");
    return;
  }

  participants.push({ name, numbers });
  saveToServer("participants", participants);
  alert(`${name} 참가자가 추가되었습니다.`);

  document.getElementById("name").value = "";
  document.querySelectorAll(".lotto-number").forEach((input) => (input.value = ""));
  updateParticipantList();
});

// 당첨 번호 생성
document.getElementById("generate-numbers").addEventListener("click", () => {
  requireHostPassword(() => {
    const numbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 1).sort((a, b) => a - b);
    document.getElementById("winning-numbers-public").textContent = numbers.join(", ");
    saveToServer("winningNumbers", numbers);
    toggleAddParticipantButton(false); // 참가자 추가 버튼 비활성화
    alert("당첨 번호가 생성되었습니다.");
  });
});

// 초기화 버튼 동작
document.getElementById("reset-data").addEventListener("click", () => {
  requireHostPassword(() => {
    localStorage.removeItem("participants");
    localStorage.removeItem("winningNumbers");
    document.getElementById("winning-numbers-public").textContent = "아직 생성되지 않았습니다.";
    document.getElementById("participant-list").innerHTML = "참가자가 없습니다.";
    toggleAddParticipantButton(true); // 참가자 추가 버튼 활성화
    alert("모든 데이터가 초기화되었습니다.");
  });
});

// 비밀번호 변경
document.getElementById("change-password").addEventListener("click", () => {
  requireHostPassword(() => {
    const newPassword = prompt("새 비밀번호를 입력하세요:");
    if (newPassword && newPassword.trim().length > 0) {
      HOST_PASSWORD = newPassword.trim();
      saveToServer("hostPassword", HOST_PASSWORD);
      alert("비밀번호가 성공적으로 변경되었습니다.");
    } else {
      alert("유효한 비밀번호를 입력하세요.");
    }
  });
});

// 참가자 리스트 보기
document.getElementById("view-participants").addEventListener("click", () => {
  requireHostPassword(() => {
    updateParticipantList();
    alert("참가자 리스트를 확인하세요.");
  });
});

// 참가자 리스트를 페이지에 표시
function updateParticipantList() {
  const participants = loadFromServer("participants") || [];
  const listContainer = document.getElementById("participant-list");

  if (participants.length === 0) {
    listContainer.innerHTML = "참가자가 없습니다.";
    return;
  }

  const listContent = participants
    .map((p) => `<li>${p.name}: ${p.numbers.join(", ")}</li>`)
    .join("");
  listContainer.innerHTML = `<ul>${listContent}</ul>`;
}

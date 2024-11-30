document.getElementById("add-participant").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const numbers = Array.from(document.querySelectorAll(".lotto-number")).map((input) =>
    parseInt(input.value, 10)
  );

  if (!name || numbers.some(isNaN) || numbers.length !== 6) {
    alert("올바른 이름과 6개의 번호를 입력해주세요.");
    return;
  }

  if (participants.some((participant) => participant.name === name)) {
    alert("이미 동일한 이름의 참가자가 존재합니다.");
    return;
  }

  participants.push({ name, numbers });
  alert(`${name} 참가자가 추가되었습니다.`);
  document.getElementById("name").value = "";
  document.querySelectorAll(".lotto-number").forEach((input) => (input.value = ""));
});

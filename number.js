let winningNumbers = []; // 당첨 번호

document.getElementById("generate-numbers").addEventListener("click", () => {
  if (winningNumbers.length > 0) {
    alert("이미 당첨 번호가 생성되었습니다.");
    return;
  }

  while (winningNumbers.length < 6) {
    const number = Math.floor(Math.random() * 45) + 1;
    if (!winningNumbers.includes(number)) {
      winningNumbers.push(number);
    }
  }

  winningNumbers.sort((a, b) => a - b);
  document.getElementById("winning-numbers").textContent = winningNumbers.join(", ");
  document.getElementById("winning-numbers-display").classList.remove("d-none");

  alert("당첨 번호가 생성되었습니다.");
});

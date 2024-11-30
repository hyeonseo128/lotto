// DOMContentLoaded로 DOM 로드 후 실행
document.addEventListener("DOMContentLoaded", () => {
  const deleteParticipantButton = document.getElementById("delete-participant");
  const viewRankingsButton = document.getElementById("view-rankings");

  // 참가자 삭제
  if (deleteParticipantButton) {
    deleteParticipantButton.addEventListener("click", () => {
      const nameToDelete = prompt("삭제할 참가자의 이름을 입력하세요:");
      if (!nameToDelete) {
        alert("이름을 입력하지 않았습니다.");
        return;
      }

      let participants = JSON.parse(localStorage.getItem("participants") || "[]");
      const initialLength = participants.length;
      participants = participants.filter((participant) => participant.name !== nameToDelete);

      if (participants.length === initialLength) {
        alert("해당 이름의 참가자가 없습니다.");
      } else {
        localStorage.setItem("participants", JSON.stringify(participants));
        alert(`${nameToDelete} 참가자가 삭제되었습니다.`);
        updateParticipantList();
      }
    });
  } else {
    console.error("참가자 삭제 버튼을 찾을 수 없습니다.");
  }

  // 등수 보기
  if (viewRankingsButton) {
    viewRankingsButton.addEventListener("click", () => {
      // 참가자와 당첨 번호 가져오기
      const participants = JSON.parse(localStorage.getItem("participants") || "[]");
      const winningNumbers = JSON.parse(localStorage.getItem("winningNumbers") || "[]");

      if (winningNumbers.length !== 6) {
        alert("당첨 번호가 생성되지 않았습니다.");
        return;
      }

      // 참가자 등수 계산
      const rankings = participants
        .map((participant) => ({
          name: participant.name,
          matches: participant.numbers.filter((number) => winningNumbers.includes(number)).length,
        }))
        .sort((a, b) => b.matches - a.matches); // 일치 개수 기준으로 내림차순 정렬

      // 결과 콘텐츠 생성
      const content = rankings.length
        ? rankings.map((rank, index) => `${index + 1}등: ${rank.name} (${rank.matches}개 일치)`).join("<br>")
        : "참가자가 없습니다.";

      // 결과를 표시
      const resultContent = document.getElementById("result-content");
      resultContent.innerHTML = content;

      const resultDiv = document.getElementById("results");
      if (resultDiv) {
        resultDiv.classList.remove("d-none");
      }
    });
  } else {
    console.error("등수 보기 버튼을 찾을 수 없습니다.");
  }

  // 참가자 리스트 업데이트
  window.updateParticipantList = function () {
    const participants = JSON.parse(localStorage.getItem("participants") || "[]");
    const listContainer = document.getElementById("participant-list");

    if (participants.length === 0) {
      listContainer.innerHTML = "참가자가 없습니다.";
      return;
    }

    const listContent = participants
      .map((participant) => `<li>${participant.name}: ${participant.numbers.join(", ")}</li>`)
      .join("");
    listContainer.innerHTML = `<ul>${listContent}</ul>`;
  };
});

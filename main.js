const basePath = window.location.origin +
    window.location.pathname.replace(/[^/]+$/, "");
const gameForm = document.querySelector("#selection");
gameForm.addEventListener("submit", function (e) {
    selectGame(e);
})
function selectGame(e){
    e.preventDefault();
    window.location.href =
        `${basePath}game/${e.target.children[1].value}.html`;
}
$('#openSearch').click(function(){
    $('.searchArea').addClass('show');
});
$('#closeSearch').click(function(){
    $('.searchArea').removeClass('show');
});

document.multiselect('items-dropdown');

// let hrs = "";
// let min = "";
// for (let i = 0; i <= 12; i++) {
//     hrs += "<option>" + i + "</option>";
//     if(i == 12){
//         hrs += "<option selected>" + i + "</option>";
//     }
// }
// for(let j = 0; j < document.getElementsByClassName("hr").length; j++) {
//     document.getElementsByClassName("hr")[j].innerHTML = hrs
// }
// for (let i = 0; i <= 60; i++) {
//     min += "<option>" + i + "</option>";
// }
// for(let j = 0; j < document.getElementsByClassName("min").length; j++) {
//     document.getElementsByClassName("min")[j].innerHTML = min
// }

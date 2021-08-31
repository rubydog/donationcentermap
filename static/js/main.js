$('#openSearch').click(function(){
    $('.searchArea').addClass('show');
});
$('#closeSearch').click(function(){
    $('.searchArea').removeClass('show');
});

let hrs = "";
let min = "";
for (let i = 0; i <= 12; i++) {
    hrs += "<option>" + i + "</option>";
    if(i == 12){
        hrs += "<option selected>" + i + "</option>";
    }
}
for(let j = 0; j < document.getElementsByClassName("hr").length; j++) {
    document.getElementsByClassName("hr")[j].innerHTML = hrs
}
for (let i = 0; i <= 60; i++) {
    min += "<option>" + i + "</option>";
}
for(let j = 0; j < document.getElementsByClassName("min").length; j++) {
    document.getElementsByClassName("min")[j].innerHTML = min
}

let hours ={
    "monday":{
        'available': true,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "tuesday":{
        'available': true,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "wednesday":{
        'available': true,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "thursday":{
        'available': true,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "friday":{
        'available': true,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "saturday":{
        'available': true,
        "opening" : "10:00",
        "closing": "17:00"
    },
    "sunday":{
        'available': true,
        "opening" : "10:00",
        "closing": "17:00"
    }
}
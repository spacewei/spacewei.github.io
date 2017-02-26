/**
 * Created by SPACEY on 2016/12/3.
 */
//new出实例,使用插件
console.log('xxx11:');
var xxx11 = new calendarSpacePlug('Show','.calendar-space-there21');
console.log(xxx11.getCalendarSpaceDate());

console.log('xxx12:');
var xxx12 = new calendarSpacePlug('Show','.calendar-space-there22');
console.log(xxx12.getCalendarSpaceDate());
//var xxx13 = new calendarSpacePlug('Show','.calendar-space-there23');

console.log('-------------------');

console.log('xxx21:');
var xxx21 = new calendarSpacePlug('Toggle','.calendar-space-there11');
console.log(xxx21.getCalendarSpaceDate());

console.log('xxx22:');
var xxx22 = new calendarSpacePlug('Toggle','.calendar-space-there12');
console.log(xxx22.getCalendarSpaceDate());

console.log('-------------------');
//var xxx23 = new calendarSpacePlug('Toggle','.calendar-space-there13');
$('.show-date').on('click',function(){
    console.log('-------------------');
    console.log('-------------------');
    console.log('xxx11:');
    var date1 = xxx11.getCalendarSpaceDate();
    console.log(date1);
    console.log('xxx12:');
    var date2 = xxx12.getCalendarSpaceDate();
    console.log(date2);
    console.log('-------------------');
    console.log('xxx21:');
    var date3 = xxx21.getCalendarSpaceDate()
    console.log(date3);
    console.log('xxx22:');
    var date4 = xxx22.getCalendarSpaceDate()
    console.log(date4);
    console.log('-------------------');
    $('.show').append(date1.year,date1.month,date1.date);
    $('.show').append('<br>');
    $('.show').append(date2.year,date2.month,date2.date);
    $('.show').append('<br>');
    $('.show').append(date3.year,date3.month,date3.date);
    $('.show').append('<br>');
    $('.show').append(date4.year,date4.month,date4.date);
    $('.show').append('<br>');
});
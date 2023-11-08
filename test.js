let dateStr = '2023-11-07T16:00:00.000+00:00';
let dateObj = new Date(dateStr);
let formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
});
formattedDate = formattedDate + ' 08';
console.log(formattedDate); // Outputs: "Wed Nov 08 2023"

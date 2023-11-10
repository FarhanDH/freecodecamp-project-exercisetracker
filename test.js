const log = [
    {
        description: 'ini deskripsi',
        duration: 30,
        date: new Date('Fri Nov 10 2023'),
    },
    {
        description: 'ini deskripsi4',
        duration: 100,
        date: new Date('Mon Sep 07 2020'),
    },
    {
        description: 'ini deskripsi4',
        duration: 100,
        date: new Date('Fri Feb 11 2000'),
    },
    {
        description: 'ini deskripsi',
        duration: 30,
        date: new Date('Fri Nov 08 2024'),
    },
];

const result = log
    .filter(
        (el) =>
            Date.UTC(
                el.date.getFullYear(),
                el.date.getMonth(),
                el.date.getDate()
            ) >= Date.UTC('2000-01-11') &&
            Date.UTC(
                el.date.getFullYear(),
                el.date.getMonth(),
                el.date.getDate()
            ) <= Date.UTC('2020-08,07')
    )
    .map((el) => ({ ...el, date: el.date.toISOString() }));

console.log(result);

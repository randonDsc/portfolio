import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


async function loadData() {
    const data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line), // or just +row.line
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
    }));
  
    return data;
}


function processCommits(data) {
    return d3
        .groups(data, (d) => d.commit)
        .map(([commit, lines]) => {
        // Each 'lines' array contains all lines modified in this commit
        // All lines in a commit have the same author, date, etc.
        // So we can get this information from the first line
        let first = lines[0];

        // We can use object destructuring to get these properties
        let { author, date, time, timezone, datetime } = first;
  
        // What information should we return about this commit?
        return {
            id: commit,
            author,
            date,
            time,
            timezone,
            datetime,
            // What other properties might be useful?
            // Calculate hour as a decimal for time analysis
            // e.g., 2:30 PM = 14.5
            hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
            // How many lines were modified?
            totalLines: lines.length,


        };
    });
}
  
let data = await loadData();
let commits = processCommits(data);
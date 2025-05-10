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
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: 'https://github.com/vis-society/lab-7/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        // What other options do we need to set?
        // Hint: look up configurable, writable, and enumerable
        enumerable: false,
        configurable: true,
        writable: true,
      });

      return ret;
    });
}

function renderCommitInfo(data, commits) {
    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');

    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);

    // Add total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);

    //num files
    const num_files = d3.group(data, d => d.file).size;
    dl.append('dt').text('Number of files');
    dl.append('dd').text(num_files);

    // Average file length
    const avg_f_len = data.length / num_files;
    dl.append('dt').text('Average file length');
    dl.append('dd').text(Math.round(avg_f_len));

    //Longest file
    const file_lengths = d3.rollups(
    data,
    v => d3.max(v, d => d.line), 
    d => d.file
    );
    const longest = d3.greatest(file_lengths, d => d[1])?.[0];
    dl.append('dt').text('Longest File');
    dl.append('dd').text(longest);
}

let data = await loadData();
let commits = processCommits(data);

renderCommitInfo(data, commits);
console.log(commits);
console.log(data);
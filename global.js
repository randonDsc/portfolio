console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$('nav a');

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname,
//   );


// if (currentLink) {
//     // or if (currentLink !== undefined)
//     currentLink.classList.add('current');
//   } step 2

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/randonDsc', title: 'GitHub' },
  ];

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
? "/"                  // Local server
: "/portfolio/";         // GitHub Pages repo name

let nav = document.createElement('nav');
document.body.prepend(nav);
  
for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // next step: create link and add it to nav
    if (!url.startsWith('http')) {
        url = BASE_PATH + url;
      }

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host !== location.host) {
        a.target = '_blank';
    }

    nav.append(a);
  }

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark" selected>Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
		</select>
	</label>`,
);

let select = document.querySelector('.color-scheme select');

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    select.value = colorScheme;
}
  

select.addEventListener('input', function (event) {
    const colorScheme = event.target.value;
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = colorScheme;
    setColorScheme(colorScheme);
});

if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

//lab 4
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    //parse json
    const data = await response.json();
    return data;
    console.log(response);
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

//lab4 1.4

export function renderProjects(project, containerElement, headingLevel = 'h2') {
    // Validate the containerElement
    if (!(containerElement instanceof HTMLElement)) {
      console.error('Invalid containerElement provided.');
      return; // Exit early if the containerElement is invalid
    }
  // Your code will go here
  containerElement.innerHTML = '';
  project.forEach((project) => {
    // Create a new article element for each project
    const article = document.createElement('article');

    //handle missing, make sure to comment out if no placing one
    // const title = project.title || 'Untitled Project';  
    // const image = project.image || 'default-image.jpg';  
    // const description = project.description || 'No description available.';

    const heading = document.createElement(headingLevel); 
    heading.textContent = project.title; 

    //Use the innerHTML property to populate the <article> element with dynamic content.
    article.innerHTML = `
    ${heading.outerHTML} <!-- Add the dynamically created heading here -->
    <img src="${project.image}" alt="${'no image for now'}">
    <p>${project.description}</p>
  `;

    //append the <article> element to the provided containerElement
    containerElement.appendChild(article);
  });
}


"use strict";

async function fetchData() {
  const response = await fetch(
    "http://www.omdbapi.com/?i=tt3896198&apikey=5b81342d"
  );
  const data = await response.json();
  return data;
}

async function main() {
  const data = await fetchData();
  console.log(data);
}

main();

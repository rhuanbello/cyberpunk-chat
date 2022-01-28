import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.github.com/users",
});

const supabaseUrl = 'https://pjcddalbuqnotirmwpej.supabase.co'
const supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyODE1MywiZXhwIjoxOTU4OTA0MTUzfQ.p0NvOU5LN1m1Ii44sFzaZNqfsMe6XVpk5WFkg0n0YY0'

export const supApi = axios.create({
  baseURL: supabaseUrl + '/rest/v1',
  headers: { 
    'Content-Type': 'aplication/json',
    'apiKey': supabaseUrl,
    'Authorization': 'Bearer ' + supabaseAnon,
  }
});


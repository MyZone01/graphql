import * as query from "./queryStrings.js";

const authToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4NTIxIiwiaWF0IjoxNzA1MjIxNzQxLCJpcCI6IjE1NC4xMjUuMjA2LjEzOSwgMTcyLjE4LjAuMiIsImV4cCI6MTcwNTMwODE0MSwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtY2FtcHVzZXMiOiJ7fSIsIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiODUyMSIsIngtaGFzdXJhLXRva2VuLWlkIjoiOTZmOGRhM2UtMDFjNC00MDE1LWFiODQtMGViMWZiNTJlNzUwIn19.fvWaVOz5T64zPGfGrpoygbgQ434LxE050Gabo9z__4c";

const gradeQuery = {
    method: "post",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({
        query: query.gradeQueryString,
    }),
};

const userIDQuery = {
    method: "post",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({
        query: query.userIDQueryString,
    }),
};

const totalXPQuery = {
    method: "post",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({
        query: query.totalXPQueryString,
    }),
};

const xpPerTypeQuery = {
    method: "post",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({
        query: query.xpPerTypeQueryString,
    }),
};

const skillQuery = {
    method: "post",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
    },
    body: JSON.stringify({
        query: query.skillQueryString,
    }),
};

export { gradeQuery, userIDQuery, totalXPQuery, xpPerTypeQuery, skillQuery };

const gradeQueryString = `{
  user(where: {login: {_eq: "serignmbaye"}}) {
    progresses(
      where: {_and: [{object: {type: {_eq: "project"}}}, {isDone: {_eq: true}}]}
      order_by: {updatedAt: asc}
    ) {
      object {
        name
      }
      grade
    }
  }
}`;

const userIDQueryString = `{
  user(where:{login: {_eq: "serignmbaye"}}){
    id
    login
    progresses{
      campus
    }
   }
}`;

const totalXPQueryString = `{
  user(where: {login: {_eq: "serignmbaye"}}) {
    transactions(
      where: {_and: [{object: {type: {_eq: "project"}}}, {user: {login: {_eq: "serignmbaye"}}}, {type: {_eq: "xp"}}]}
      order_by: {amount: desc}
    ) {
      amount
      object {
        name
      }
    }
  }
}`;

const xpPerTypeQueryString = `query{
  user(where:{_and:[{login: {_eq: "serignmbaye"}}, {progresses:{isDone:{_eq:true}}}]}){
   a: transactions(limit:50 offset:0 where:{type:{_eq:"xp"}} order_by:{amount:desc}){
      object{
        name
        type
      }
      amount
    }
    b: transactions(limit:50 offset:50 where:{type:{_eq:"xp"}}order_by:{amount:desc}){
      object{
        name
        type
      }
      amount
    }
    c: transactions(limit:50 offset:100 where:{type:{_eq:"xp"}}order_by:{amount:desc}){
      object{
        name
        type
      }
      amount
    }
    d: transactions(limit:50 offset:150 where:{type:{_eq:"xp"}}order_by:{amount:desc}){
      object{
        name
        type
      }
      amount
    }
    e: transactions(limit:50 offset:200 where:{_and:[{type:{_eq:"xp"}}]} order_by:{amount:desc}){
      object{
        name
        type
       reference{
        type
      }
      }
      amount
    }
  }
}
  `;

const skillQueryString = `{
    user(where: {login: {_eq: "serignmbaye"}}) {
      transactions(where:{_and:[{type:{_like:"%skill%"}}, {object:{type:{_eq:"project"}}}]}
        order_by:{createdAt:desc}
      ) {
        createdAt
        amount
        type
        path
        user{
          login
        }
        userId
        object {
          name
          type
        }
      }
    }
  }`;

export {
    gradeQueryString,
    userIDQueryString,
    totalXPQueryString,
    xpPerTypeQueryString,
    skillQueryString,
};

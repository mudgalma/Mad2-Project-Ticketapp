const Show = Vue.component("Show", {
    template: `<li>
    Ratings:{{ratings}},Price:{{price}},Tags:{{tags}},Id:{{id}}</li>`,
    props: ['ratings', 'price', 'tags', 'id'],

})
export default Show
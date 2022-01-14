
const toastSuccess = (msg)=>{ iziToast.success({title: 'OK', message: msg})};
const toastWarning = (msg)=>{ iziToast.warning({title: 'Hmm', message: msg})};
const toastError   = (msg)=>{ iziToast.error({title: 'Ooops', message: msg})};
const toastInfo    = (msg)=>{ iziToast.info({title: '', message: msg})};

const Grafito = {
    data() {
        return {
            performInitialSetup: false,
            config: {
                fetchNeighbors: true
            },
            working: false,
            graph: {
                dataset: {},
                view: {},
                selected: null,
                data: {
                    nodes: [],
                    edges: []
                },
                config: {
                    nodes: {
                        shape: "circle",
                        font: {
                            face: "Roboto",
                            color: "white",
                            align: "center"
                        },
                        widthConstraint: 60,
                    },
                    edges:{
                        arrows: {
                            to: {
                                enabled: true,
                                scaleFactor: 0.5,
                                type: "arrow"
                            }
                        },
                        length: 3.0
                    },
                    interaction: {
                        hover: true
                    },
                    physics: {
                        barnesHut: {
                            springConstant: 0.03,
                            avoidOverlap: 0.2
                        }
                    }
                }
            },
            table: {
                keys: [],
                rows: []
            },
            command: {
                focused: false
            },
            sidebar: {
                hovered: "",
                active: "graph",
                items: [
                    "graph",
                    "table",
                    "sliders"
                ]
            },
            infobar: {
                tag: {},
                paths: []
            }
        }
    },
    methods: {
        updateInfo(paths, tag="INFO", tagBg="#CCC", tagFg="white"){
            this.infobar = {
                tag: {
                    caption: tag,
                    style: {
                        color: (tagBg=="#CCC" ? "black" : tagFg),
                        backgroundColor: tagBg
                    }
                },
                paths: paths
            }
        },

        showDefaultInfo(){
            this.updateInfo({
                "Showing": `${this.graph.data.nodes.length} nodes and ${this.graph.data.edges.length} edges`
            });
        },

        processCommand(){
            console.log("Grafito:: Processing command...");

            this.working = true;
            $.post( "/exec", {command: $(".command input").val()}, (data)=>{
                if (data!="empty"){
                    console.log("got:", data); 
                    if (data=="error"){
                        toastError("Something went wrong. Check your syntax!");
                    }
                    else {
                        try {
                            dd = JSON.parse(data);
                            this.drawGraph(dd["data"], clean=true);
                            this.drawTable(dd["rows"]);
                            toastSuccess(`Query executed in ${dd["timeTaken"].toFixed(2)} ms`);
                        }
                        catch (e) {
                            console.log(e);
                            toastError("Something went wrong!");
                        }
                    }
                }
                else {
                    toastSuccess("Query performed");
                }
                this.working = false;
            });
        },

        drawGraph(dataset, clean=false){
            // if we're re-drawing the graph,
            // let's first delete all previous data
            if (clean){
                this.graph.data.nodes.clear();
                this.graph.data.edges.clear();
            }

            // create an array with nodes
            let nodes = new vis.DataSet(dataset.nodes);

            // create an array with edges
            let edges = new vis.DataSet(dataset.edges);

            // create the graph
            let container = document.getElementById("graph");
            this.graph.data = {
                nodes: nodes,
                edges: edges,
            };

            this.graph.view = new vis.Network(container, this.graph.data, this.graph.config);

            this.showDefaultInfo();

            this.graph.view.on("selectNode", (x)=>{
                this.graph.selected = this.graph.data.nodes.get(x);
            });

            this.graph.view.on("deselectNode", (x)=>{
                this.graph.selected = null;
            });

            this.graph.view.on("doubleClick", (x)=>{
                $.post("/nodeFromId", {ndid: x.nodes[0] }, (data)=>{
                    let dt = JSON.parse(data);
                    for (var node of dt.nodes){
                        this.graph.data.nodes.update(node);
                    }
                    for (var edge of dt.edges){
                        this.graph.data.edges.update(edge);
                    }
                });
            });
            this.graph.view.on("hoverNode", (x)=>{
                let node = nodes.get(x.node);

                this.updateInfo(node.properties, node.tag, node.color); 
            });

            this.graph.view.on("hoverEdge", (ev)=>{
                let edge = edges.get(ev.edge);
                let nodeFrom = nodes.get(edge.from);
                let nodeTo = nodes.get(edge.to);

                this.updateInfo({
                    "from": `${nodeFrom.tag} (${nodeFrom.id})`,
                    "to": `${nodeTo.tag} (${nodeTo.id})`
                }, edge.label, "black", "white");
            });

            this.graph.view.on("blurNode", ()=>{
                this.showDefaultInfo();
            });

            this.graph.view.on("blurEdge", ()=>{
                this.showDefaultInfo();
            });
        },

        drawTable(rows){
            var keys = Object.keys(rows[0].properties);
            for (var row of rows){
                keys = keys.filter(value => Object.keys(row.properties).includes(value));
            }
            for (var row of rows){
                for (var prop of Object.keys(row.properties)){
                    if (!keys.includes(prop)){
                        keys.push(prop);
                    }
                }
            }
            keys.unshift("id");
            keys.unshift("tag");

            this.table.keys = keys;
            this.table.rows = rows.map(row=>
                Object.assign({
                    tag: row.tag,
                    id: row.id
                }, row.properties)
            );
        }
    },

    mounted(){
        console.log("Grafito:: App started");

        $.post("/startup", {}, (dd)=>{
            let obj = JSON.parse(dd);

            document.title = `Grafito @ ${obj.title}`;
            this.drawGraph(obj.data);
            this.drawTable(obj.rows);
            this.performInitialSetup = true;
        });

        window.onbeforeunload = ()=>{
            $.post( "/exit", {}, ()=>{});
            return true;
        };
    },

    updated(){
        if (this.performInitialSetup){
            let table = $("#table table").DataTable({
                //lengthChange: false,
                //searchBuilder: true,
                buttons: ['copy', 'csv', 'excel', 'pdf', 'json']
            });
            //table.searchBuilder.container().prependTo(table.table().container());
            //table.buttons().container().appendTo($("div.column.is-half", table.table().container()).eq(0));
            table.buttons().container().appendTo($(".infobar"));

            this.performInitialSetup = false;
        }
    }
}

const App = Vue.createApp(Grafito);
const VM = App.mount('#app');
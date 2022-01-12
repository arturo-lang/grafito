
function showDefaultInfo(){
    VM.updateInfo({
        "Showing": `${data.nodes.length} nodes and ${data.edges.length} edges`
    });
}

const toastSuccess = (msg)=>{ iziToast.success({title: 'OK', message: msg})};
const toastWarning = (msg)=>{ iziToast.warning({title: 'Hmm', message: msg})};
const toastError   = (msg)=>{ iziToast.error({title: 'Ooops', message: msg})};
const toastInfo    = (msg)=>{ iziToast.info({title: '', message: msg})};


function drawGraph() {
    let initial = window.dataset;

    // create an array with nodes
    let nodes = new vis.DataSet(
        initial.nodes
    );

    // create an array with edges
    let edges = new vis.DataSet(
        initial.edges
    );

    // create the graph
    let container = document.getElementById("content");
    window.data = {
        nodes: nodes,
        edges: edges,
    };

    let options = {
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
    };

    window.db = new vis.Network(container, window.data, options);

    showDefaultInfo();

    db.on("doubleClick", (x)=>{
        $.post("/nodeFromId", {ndid: x.nodes[0] }, (data)=>{
            let dt = JSON.parse(data);
            for (var node of dt.nodes){
                window.data.nodes.update(node);
            }
            for (var edge of dt.edges){
                window.data.edges.update(edge);
            }
        });
    });
    db.on("hoverNode", (x)=>{
        console.log(x);
        var ne = db.body.nodes[x.node];
        console.log(ne);
        let node = nodes.get(x.node);
        //db.canvas.body.container.style.cursor = 'pointer';
        console.log(node);

        VM.updateInfo(node.properties, node.tag, node.color); 
    });

    db.on("hoverEdge", (ev)=>{
        let edge = edges.get(ev.edge);
        let nodeFrom = nodes.get(edge.from);
        let nodeTo = nodes.get(edge.to);

        VM.updateInfo({
            "from": `${nodeFrom.tag} (${nodeFrom.id})`,
            "to": `${nodeTo.tag} (${nodeTo.id})`
        }, edge.label, "black", "white");
    });

    db.on("blurNode", (x)=>{
        showDefaultInfo();
        //db.canvas.body.container.style.cursor = 'default';
    });

    db.on("blurEdge", (x)=>{
        showDefaultInfo();
    });
}

function redrawGraph(dt){
    window.backup = window.dataset;
    window.dataset = dt;
    data.nodes.clear();
    data.edges.clear();
    drawGraph();
}

window.onbeforeunload = (evt)=>{
    // $.post( "/exit", {}, (data)=>{});
    // let e = evt || window.event
    // e.returnValue = false;
    // return false;
}

const Grafito = {
    data() {
        return {
            working: false,
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
            console.log("updating info");
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
        processCommand(){
            console.log("processing command");
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
                            j = dd["data"];
                            redrawGraph(j);
                            toastSuccess(`Query executed in ${dd["timeTaken"].toFixed(2)} ms`);
                        }
                        catch (e) {
                            toastError("Something went wrong!");
                        }
                    }
                }
                else {
                    toastSuccess("Query performed");
                }
                this.working = false;
            });
        }
    },
    mounted(){
        console.log("Grafito:: App started");

        $.post("/startup", {}, (dd)=>{
            let obj = JSON.parse(dd);
            document.title = `Grafito @ ${obj.title}`;
            window.dataset = obj.data;
            drawGraph();
        });
    }
}

const App = Vue.createApp(Grafito);
const VM = App.mount('#app');
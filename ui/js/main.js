
function showDefaultInfo(){
    VM.updateInfo({
        "Showing": `${data.nodes.length} nodes and ${data.edges.length} edges`
    });
}

function showToast(msg, mode="success"){
    if (mode=="success")
        iziToast.success({
            title: 'OK',
            message: msg,
        });
    else if (mode=="warning")
        iziToast.warning({
            title: 'Hmm',
            message: msg
        })
    else if (mode=="error")
        iziToast.error({
            title: 'Ooops',
            message: msg
        })
    else {
        iziToast.info({
            title: "",
            message: msg
        })
    }
}
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
    let container = document.getElementById("db");
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
            //title: "Sometitle",
            widthConstraint: 60,
            // color: {
            //     hover: {
            //         border: "#FF0000"
            //     }
            // }
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
        // autoResize: true,
        // height: '100%',
        // width: '100%',
        // // color: {
        // //         border: 'green',
        // //         background: '#97C2FC',
        // //         highlight: {
        // //             border: 'red',
        // //             background: '#D2E5FF'
        // //         },
        // //         hover: {
        // //             border: '#2B7CE9',
        // //             background: '#D2E5FF'
        // //         }
        // //     },
        // nodes: {
        //     chosen: true,
        //     font: { 
        //         color: "white", 
        //         face: "Roboto",
        //         align: "center" 
        //     },
        //     shape: "circle",
        //     widthConstraint: 60,
        //     heightConstraint: 60,
        //     // heightConstraint: true,
        //     // labelHighlightBold: false,
        //     borderWidth: 2,
        //     borderWidthSelected: 4,
        //     // shadow: {
        //     //     enabled: true
        //     // }
        // },
        // edges:{
        //     arrows: {
        //         to: {
        //             enabled: true,
        //             scaleFactor: 0.5,
        //             type: "arrow"
        //         }
        //     },
        //     length: 3.0
        // },
        // interaction:{
        //     hover:true,
        //     hoverConnectedEdges:false
        // },
        // physics: {
        //     barnesHut: {
        //         springConstant: 0.03,
        //         avoidOverlap: 0.2
        //     }
        // }
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
        // ne.setOptions({
        //     color: {
        //         hover: {
        //             background: node.color
        //         }
        //     }
        // });
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

        // showPath({
        //     "from": `${nodeFrom.tag}&nbsp;(${nodeFrom.id})`,
        //     "to": `${nodeTo.tag}&nbsp;(${nodeTo.id})`
        // }, edge.label, "black", "white");
        //$("#infobar").html(`<span class='infotag'>${edge.label}</span>&nbsp;<span class="infoitem"><b>from</b>: ${nodeFrom.tag} (${nodeFrom.id})</span>&nbsp;<span class="infoitem"><b>to</b>: ${nodeTo.tag} (${nodeTo.id})</span>`)
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

function makeHoverable(icon){
    $(`.ph-${icon},.ph-${icon}-fill`).parent().mouseenter((ev)=>{
        if (!($(ev.currentTarget).hasClass("active")))
            $(ev.currentTarget).find("i").removeClass(`ph-${icon}`).addClass(`ph-${icon}-fill`);
    }).mouseleave((ev)=>{
        if (!($(ev.currentTarget).hasClass("active")))
            $(ev.currentTarget).find("i").removeClass(`ph-${icon}-fill`).addClass(`ph-${icon}`);
    }).click((ev)=>{
        $(".left-col-item i").each((idx,elem)=>{
            console.log(elem.classList);
            for (var i=0; i<elem.classList.length; i++){
                let m = elem.classList[i].match(/ph\-(.+)\-fill/);
                if ((m !== null)&&(m.length>0)){
                    elem.classList.remove(`ph-${m[1]}-fill`);
                    elem.classList.add(`ph-${m[1]}`);
                    break;
                }
            }
        });
        $(".left-col-item").removeClass("active");
        $(ev.currentTarget).addClass("active");
        $(ev.currentTarget).find("i").removeClass(`ph-${icon}`).addClass(`ph-${icon}-fill`);
    });
}
// $(document).ready(function(){
//     console.log("Document.ready");
    
// });

window.onbeforeunload = (evt)=>{
    // $.post( "/exit", {}, (data)=>{});
    // let e = evt || window.event
    // e.returnValue = false;
    // return false;
}

const Grafito = {
    data() {
        return {
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
        }
    },
    mounted(){
        console.log("APP mounted");

        $.post("/startup", {}, (dd)=>{
            let obj = JSON.parse(dd);
            document.title = `Grafito @ ${obj.title}`;
            window.dataset = obj.data;
            drawGraph();
        });
        
        // $(".left-col-item i").each((x,elem)=>{
        //     console.log(elem);
        // });
        
        makeHoverable("graph");
        makeHoverable("table");
        makeHoverable("sliders");
        $("#command").on("focus", (e)=>{
            console.log("focused");
            $(".command-icon i").removeClass("ph-arrow-circle-right").addClass("ph-arrow-circle-right-fill");
        });
        $("#command").on("focusout", (e)=>{
            $(".command-icon i").addClass("ph-arrow-circle-right").removeClass("ph-arrow-circle-right-fill");
        });
        $("#command").on("keydown", (e)=>{
            if (e.keyCode === 13) {
                $.post( "/exec", {command: $("#command").val()}, (data)=>{
                    if (data!="empty"){
                        console.log("got:", data); 
                        if (data=="error"){
                            showToast(`Something went wrong. Check your syntax!`, "error");
                        }
                        else {
                            try {
                                dd = JSON.parse(data);
                                j = dd["data"];
                                redrawGraph(j);
                                showToast(`Query executed in ${dd["timeTaken"].toFixed(2)} ms`);
                            }
                            catch (e) {
                                showToast(`Something went wrong!`, "error");
                            }
                        }
                    }
                    else {
                        showToast(`Query performed`);
                    }
                });
            }
        });
    }
}

const App = Vue.createApp(Grafito);
const VM = App.mount('#app');
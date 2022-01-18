
const toastSuccess = (msg)=>{ iziToast.success({title: 'OK', message: msg})};
const toastWarning = (msg)=>{ iziToast.warning({title: 'Hmm', message: msg})};
const toastError   = (msg)=>{ iziToast.error({title: 'Ooops', message: msg})};
const toastInfo    = (msg)=>{ iziToast.info({title: '', message: msg})};

const Grafito = {
    data() {
        return {
            performInitialSetup: false,
            config: {
                versions: {},
                graphView: {
                    showNodesOnDrag: {value: true, description: "Keep showing nodes when dragging"},
                    showEdgesOnDrag: {value: true, description: "Keep showing edges when dragging"},
                    showEdgesOnZoom: {value: false, description: "Keep showing edges when zooming"},
                    showEdgeLabels: {value: true, description: "Show edge labels"}
                },
                tableView: {
                    prettifyJson: {value: true, description: "Prettify exported JSON data"}
                },
                engine: {
                    caseSensitive: {value: false, description: "Queries should be case-sensitive"}
                }
            },
            working: false,
            graph: {
                dataset: {},
                editOptions: {
                    main: [
                        {icon: "funnel-bold", tip: "Filter visible nodes", action: null},
                        {icon: "plus-bold", tip: "Add new node", action: null},
                        {icon: "arrows-clockwise-bold", tip: "Refresh view", action: null}
                    ],
                    item: {
                        visualization: [
                            {icon: "arrows-out-fill", tip: "Expand neighboring nodes", action: this.expandNodeNeighbors},
                            {icon: "eraser-fill", tip: "Remove from graph view", action: this.removeSelectedNode}
                        ],
                        database: [
                            {icon: "pencil-fill", tip: "Edit selected node", action: null},
                            {icon: "link-bold", tip: "Link selected node", action: null},
                            {icon: "trash-fill", tip: "Delete selected node", action: null}
                        ]
                    }
                },
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
                        font: {
                            size: 12
                        },
                        smooth: {
                            type: 'dynamic'
                        },
                        length: 3.0
                    },
                    interaction: {
                        hover: true,
                        hideEdgesOnZoom: true
                    },
                    layout: {

                    },
                    manipulation: false,
                    physics: {
                        barnesHut: {
                            springConstant: 0.03,
                            avoidOverlap: 0.2
                        }
                    }
                }
            },
            table: {
                showSearchBuilder: false,
                datarows: [],
                keys: [],
                rows: []
            },
            command: {
                focused: false
            },
            sidebar: {
                hovered: "",
                active: "graph",
                items: {
                    "graph": "Graph view",
                    "table": "Table view",
                    "sliders": "Global settings"
                }
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

        expandNodeNeighbors(nodeId){
            $.post("/nodeFromId", {ndid: nodeId }, (data)=>{
                let dt = JSON.parse(data);
                for (var node of dt.nodes){
                    this.graph.data.nodes.update(node);
                }
                for (var edge of dt.edges){
                    this.graph.data.edges.update(edge);
                }
            });
        },

        removeSelectedNode(nodeId){
            this.graph.data.nodes.remove(nodeId);
            if ((this.graph.selected!=null)&&(this.graph.selected.id==nodeId)){
                this.graph.selected = null;
                this.showDefaultInfo();
            }
        },

        drawGraph(dataset, clean=false){
            // if we're re-drawing the graph,
            // let's first delete all previous data
            if (clean){
                this.graph.data.nodes.clear();
                this.graph.data.edges.clear();
                this.graph.view.destroy();
            }

            // store dataset 
            this.graph.dataset = dataset;

            // create an array with nodes
            let nodes = new vis.DataSet(dataset.nodes);

            // create an array with edges
            let edges = new vis.DataSet(dataset.edges);

            // create the graph
            let container = document.getElementById("graph");
            this.graph.data = {
                nodes: new vis.DataView(nodes),
                edges: new vis.DataView(edges),
            };

            this.graph.view = new vis.Network(container, this.graph.data, this.graph.config);

            this.showDefaultInfo();

            this.graph.view.on("selectNode", (x)=>{
                let node = this.graph.data.nodes.get(x.nodes[0])
                this.graph.selected = node;
                this.updateInfo(node.properties, node.tag, node.color);
            });

            this.graph.view.on("deselectNode", (x)=>{
                this.graph.selected = null;
                this.showDefaultInfo();
            });

            this.graph.view.on("doubleClick", (x)=>{
                this.expandNodeNeighbors(x.nodes[0]);
            });

            this.graph.view.on("hoverNode", (x)=>{
                if (this.graph.selected == null){
                    let node = nodes.get(x.node);

                    this.updateInfo(node.properties, node.tag, node.color); 
                }
            });

            this.graph.view.on("hoverEdge", (ev)=>{
                if (this.graph.selected == null){
                    let edge = edges.get(ev.edge);
                    let nodeFrom = nodes.get(edge.from);
                    let nodeTo = nodes.get(edge.to);

                    this.updateInfo({
                        "from": `${nodeFrom.tag} (${nodeFrom.id})`,
                        "to": `${nodeTo.tag} (${nodeTo.id})`
                    }, edge.label, "black", "white");
                }
            });

            this.graph.view.on("blurNode", ()=>{
                if (this.graph.selected == null){
                    this.showDefaultInfo();
                }
            });

            this.graph.view.on("blurEdge", ()=>{
                if (this.graph.selected == null){
                    this.showDefaultInfo();
                }
            });
        },

        drawTable(rows){
            // store datarows
            this.table.datarows = rows;

            // get common property keys as table headers
            var keys = Object.keys(rows[0].properties);
            for (var row of rows){
                keys = keys.filter(value => Object.keys(row.properties).includes(value));
            }

            // add the missing ones
            for (var row of rows){
                for (var prop of Object.keys(row.properties)){
                    if (!keys.includes(prop)){
                        keys.push(prop);
                    }
                }
            }

            // let's remove "id" and "tag"
            // we do want them, but with our own preferred order
            keys.unshift("id");
            keys.unshift("tag");

            // set table header
            this.table.keys = keys;

            // set table rows
            this.table.rows = rows.map(row=>
                Object.assign({
                    tag: row.tag,
                    id: row.id
                }, row.properties)
            );
        },

        updateGraphView() {
            console.log("updating graph view...");
        
            this.graph.config.interaction.hideNodesOnDrag = !this.config.graphView.showNodesOnDrag.value;
            this.graph.config.interaction.hideEdgesOnDrag = !this.config.graphView.showEdgesOnDrag.value;
            this.graph.config.interaction.hideEdgesOnZoom = !this.config.graphView.showEdgesOnZoom.value;
            
            this.graph.config.edges.font.size = (this.config.graphView.showEdgeLabels.value) ? 12 : 0;

            this.graph.view.setOptions(this.graph.config);
        },

        updateEngineSettings() {
            console.log("updating enging settings");

            $.post("/updateEngine", {
                caseSensitive: this.config.engine.caseSensitive.value 
            }, ()=>{
                console.log("done")
            });
        }
    },

    mounted(){
        console.log("Grafito:: App started");

        $.post("/startup", {}, (dd)=>{
            let obj = JSON.parse(dd);

            document.title = `Grafito @ ${obj.title}`;
            this.drawGraph(obj.data);
            this.drawTable(obj.rows);
            this.config.versions = obj.versions;
            this.performInitialSetup = true;
            this.config.engine.caseSensitive.value = obj.caseSensitive;
        });

        window.onbeforeunload = ()=>{
            $.post( "/exit", {}, ()=>{});
            return true;
        };
    },

    updated(){
        if (this.performInitialSetup){
            let table = $("#table table").DataTable({
                language: {
                    lengthMenu: 
                        'Display <select>'+
                            '<option value="10">10</option>'+
                            '<option value="25">25</option>'+
                            '<option value="50">50</option>'+
                            '<option value="100">100</option>'+
                            '<option value="-1">All</option>'+
                        '</select> results',
                },
                searchBuilder: true,
                buttons: [
                    {
                        text: '<i class="ph-brackets-curly"></i>',
                        action: function ( e, dt, button, config ) {
                            let bl = null;
                            if (VM.config.tableView.prettifyJson.value)
                                bl = JSON.stringify(VM.table.datarows, null, 4);
                            else
                                bl = JSON.stringify(VM.table.datarows);

                            $.fn.dataTable.fileSave(
                                new Blob([bl]),
                                'Export.json'
                            );
                        }
                    },
                    {
                        extend:    'csvHtml5',
                        text:      '<i class="ph-file-csv"></i>'
                    },
                    {
                        extend:    'excelHtml5',
                        text:      '<i class="ph-file-xls"></i>'
                    },
                    {
                        extend:    'pdfHtml5',
                        text:      '<i class="ph-file-pdf"></i>'
                    }
                ],
                dom: "fltip"
            });

            table.buttons().container().appendTo($(".table-info"));
            table.searchBuilder.container().insertBefore($("table.dataTable"));
            let tooltips = ["Export as JSON", "Export as CSV spreadsheet", "Export as Excel spreadsheet", "Export as PDF"];
            for (let [idx,elem] of $(".dt-button").toArray().entries()){
                console.log($(elem));
                $(elem).attr({
                    "data-tippy-content": tooltips[idx],
                    "data-tippy-placement": "top",
                    "data-tippy-theme": "light"
                });
            }

            $(".dtsb-searchBuilder").addClass("hidden");
            let filterButton = $(`
                <input id="filterSwitch" type="checkbox" class="switch is-small is-info">
                <label id="filterLabel" for="filterSwitch">Additional filters</label>
            `);
            filterButton.change(()=>{
                if ($("#filterSwitch").is(":checked"))
                    $(".dtsb-searchBuilder").removeClass("hidden");
                else {
                    $(".dtsb-searchBuilder").addClass("hidden");
                }
            });
            filterButton.appendTo($(".dataTables_filter label"));

            tippy("[data-tippy-content]",{
                offset: [0, 20],
                delay: [500, 0]
            });

            this.performInitialSetup = false;
        }
    }
}

const App = Vue.createApp(Grafito);
const VM = App.mount('#app');
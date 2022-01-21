
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
                    showEdgeLabels: {value: true, description: "Show edge labels"},
                    askForConfirmation: {value: true, description: "Always request confirmation before deleting elements"}
                },
                tableView: {
                    prettifyJson: {value: true, description: "Prettify exported JSON data"}
                },
                engine: {
                    caseSensitive: {value: false, description: "Queries should be case-sensitive"}
                },
                general: {
                    darkTheme: {value: false, description: "Enable dark theme"}
                }
            },
            working: false,
            graph: {
                dataset: {},
                dataview: {
                    nodes: [],
                    edges: []
                },
                hovered: {
                    node: null,
                    edge: null
                },
                editOptions: {
                    main: {
                        visualization: [
                            {icon: "funnel-bold", tip: "Filter visible elements", action: this.showFilterDialog},
                            {icon: "arrows-clockwise-bold", tip: "Refresh view", action: this.refreshGraph}
                        ],
                        database: [
                            {icon: "plus-bold", tip: "Add new node", effect: "modifying", action: this.showAddNodeDialog}
                        ]
                    },
                    node: {
                        visualization: [
                            {icon: "arrows-out-fill", tip: "Expand neighboring nodes", action: this.expandNodeNeighbors},
                            {icon: "eye-slash-bold", tip: "Hide node from graph view", action: this.removeNode}
                        ],
                        database: [
                            {icon: "pencil-fill", tip: "Edit selected node", effect: "modifying", action: this.showEditNodeDialog},
                            {icon: "link-bold", tip: "Link selected node", effect: "modifying", action: this.linkNodeMode},
                            {icon: "trash-fill", tip: "Delete selected node", effect: "destructive", action: this.deleteNode}
                        ]
                    },
                    nodes: {
                        visualization: [
                            {icon: "arrows-out-fill", tip: "Expand neighboring nodes", action: this.expandNodeNeighbors},
                            {icon: "eye-slash-bold", tip: "Hide nodes from graph view", action: this.removeNode}
                        ],
                        database: [
                            {icon: "trash-fill", tip: "Delete selected nodes", effect: "destructive", action: this.deleteNode}
                        ]
                    },
                    edge: {
                        visualization: [
                            {icon: "eye-slash-bold", tip: "Hide edge from graph view", action: this.removeEdge}
                        ],
                        database: [
                            {icon: "pencil-fill", tip: "Edit selected edge", effect: "modifying", action: this.showEditEdgeDialog},
                            {icon: "trash-fill", tip: "Delete selected edge", effect: "destructive", action: this.deleteEdge}
                        ]
                    },
                    edges: {
                        visualization: [
                            {icon: "eye-slash-bold", tip: "Hide edges from graph view", action: this.removeEdge}
                        ],
                        database: [
                            {icon: "trash-fill", tip: "Delete selected edges", effect: "destructive", action: this.deleteEdge}
                        ]
                    },
                    all: {
                        visualization: [
                            {icon: "eye-slash-bold", tip: "Hide elements from graph view", action: this.removeElement}
                        ],
                        database: [
                            {icon: "trash-fill", tip: "Delete selected elements", effect: "destructive", action: this.deleteElement}
                        ]
                    }
                },
                view: {},
                filter: {
                    edges: {},
                    nodes: {}
                },
                selected: {
                    node: [],
                    edge: []
                },
                data: {
                    nodes: [],
                    edges: []
                },
                initialized: false,
                config: {
                    nodes: {
                        shape: "circle",
                        font: {
                            face: "Roboto",
                            color: "white",
                            align: "center"
                        },
                        widthConstraint: 70,
                        borderWidthSelected: 5
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
                            face: "Roboto",
                            size: 12
                        },
                        smooth: {
                            type: 'dynamic'
                        },
                        length: 3.0
                    },
                    interaction: {
                        hover: true,
                        hideEdgesOnZoom: true,
                        hoverConnectedEdges: true,
                        selectConnectedEdges: false,
                        navigationButtons: true,
                        multiselect: true
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
            modal: {
                active: false,
                title: "Some title",
                icon: "",
                mode: null,
                accept: {
                    button: "Yes, I accept it",
                    style: "",
                    action: ()=> {console.log("modal action clicked!");}
                },
                fields: {

                },
                showAdd: false,
                addField: "",
                addFieldType: "String",
                showAddActive: false,
                showCancel: true
            }
        }
    },
    methods: {
        getInputTypeForValue(val){
            if (typeof val == "boolean") return "checkbox";
            if (typeof val == "string") return "text";

            return "number";
        },

        processCommand(){
            console.log("Grafito:: Processing command...");

            this.working = true;
            $.post( "/exec", {command: $(".command input").val()}, (data)=>{
                if (data!="empty"){
                    if (data=="error"){
                        toastError("Something went wrong. Check your syntax!");
                    }
                    else {
                        try {
                            dd = JSON.parse(data);

                            this.drawGraph(dd["data"], clean=true, firstDraw=true);
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

        // TODO(expandNodeNeighbors) Seems buggy
        //  To check & re-visit

        expandNodeNeighbors(nodeId=null){
            if (nodeId==null) 
                nodeId = this.graph.selected.node.id;

            $.post("/nodeFromId", {ndid: nodeId }, (data)=>{
                let dt = JSON.parse(data);
                console.log(dt);
                for (var node of dt.nodes){
                    this.graph.data.nodes.update(node);
                }
                for (var edge of dt.edges){
                    this.graph.data.edges.update(edge);
                }
                // FIX: Something weird going on with 
                // graph.data & graph.dataview synchronization

                this.resetFilterData(nomatterwhat=false);
                // this.graph.dataview.nodes.refresh();
                // this.graph.dataview.edges.refresh();
            });
        },

        removeNode(nodeId=null){
            let list = [];

            if (nodeId==null) 
                list = this.graph.selected.node.map((x)=> x.id);

            for (var node of list)
                this.graph.data.nodes.remove(node);

            this.graph.selected.node = this.graph.selected.node.filter((x)=> !list.includes(x.id));
        },

        deleteNode(nodeId=null){
            let doDelete = ()=>{
                if (nodeId==null) 
                    nodeId = this.graph.selected.node.id;

                $.post("/deleteNode", {ndid: nodeId }, ()=>{
                    this.removeNode(nodeId);
                });
            }
            
            if (this.config.graphView.askForConfirmation.value) 
                this.showConfirmationDialog("Delete selected node", doDelete);
            else
                doDelete();
        },

        removeEdge(edgeId=null){
            let list = [];

            if (edgeId==null) 
                list = this.graph.selected.edge.map((x)=> x.id);

            for (var edge of list)
                this.graph.data.edges.remove(edge);

            this.graph.selected.edge = this.graph.selected.edge.filter((x)=> !list.includes(x.id));
        },

        deleteEdge(edgeId=null){
            let doDelete = ()=>{
                if (edgeId==null) 
                    edgeId = this.graph.selected.edge.id;

                $.post("/deleteEdge", {egid: edgeId }, ()=>{
                    this.removeEdge(edgeId);
                });
            }
            
            if (this.config.graphView.askForConfirmation.value) 
                this.showConfirmationDialog("Delete selected edge", doDelete);
            else
                doDelete();
        },

        linkNodeMode(nodeId=null){
            if (nodeId==null) 
                nodeId = this.graph.selected.node.id;

            console.log("UNIMPLEMENTED");
        },

        showConfirmationDialog(title, callback, button="Delete", style="is-destructive"){
            this.modal.title = title;
            this.modal.mode = "confirmation";
            this.modal.accept.button = button;
            this.modal.accept.style = style;
            this.modal.accept.action = callback;
            this.modal.showAdd = false;
            this.modal.showCancel = true;
            this.modal.icon = "trash-fill";

            this.modal.active = true;
        },

        showFilterDialog(){
            this.modal.title = "Filter elements";
            this.modal.mode = "filter";
            this.modal.accept.button = "Done"
            this.modal.accept.style = "";
            this.modal.accept.action = ()=>{};
            this.modal.showAdd = false;
            this.modal.showCancel = false;
            this.modal.icon = "funnel-bold";

            this.modal.active = true;
        },

        showAddNodeDialog(){
            this.modal.title = "Add node";
            this.modal.active = true;

            console.log("UNIMPLEMENTED");
        },

        addNewNodeField(){
            if (this.modal.addFieldType=='String') 
                this.modal.fields[this.modal.addField]=''; 
            else if (this.modal.addFieldType=='Number') 
                this.modal.fields[this.modal.addField]=0;
            else
                this.modal.fields[this.modal.addField]=false; 

            this.modal.showAddActive=false;
            this.modal.addField = '';
            this.modal.addFieldType = 'String';
        },

        showEditNodeDialog(){
            let nodeId = this.graph.selected.node.id;
            let node = this.graph.data.nodes.get(nodeId);

            this.modal.title = "Edit node";
            this.modal.mode = "edit";
            this.modal.accept.button = "Save";

            // TODO(edit node) fields appearing empty 
            //  mainly the Name field; weird...
            //  labels: bug, ui 

            this.modal.accept.action = ()=>{
                node.tag = this.modal.fields.tag;
                delete this.modal.fields.tag;
                node.properties = this.modal.fields;

                // TODO(edit node) should be able to set tag as well
                $.post("/updateNode", {
                    ndid: nodeId, 
                    props: JSON.stringify(node.properties) 
                }, ()=>{
                    this.graph.data.nodes.update(node);
                });
            };
            this.modal.accept.style = "is-modifying";
            this.modal.showAdd = true;
            this.modal.addField = "";
            this.modal.addFieldType = "String";
            this.modal.showCancel = true;
            this.modal.icon = "pencil-fill";

            this.modal.fields = Object.assign({
                tag: node.tag,
            }, node.properties);

            this.modal.active = true;
        },

        showEditEdgeDialog(){
            let edgeId = this.graph.selected.edge.id;
            let edge = this.graph.data.edges.get(edgeId);

            this.modal.title = "Edit edge";
            this.modal.mode = "edit";
            this.modal.accept.button = "Save";
            
            this.modal.accept.action = ()=>{
                edge.label = this.modal.fields.label;
                this.graph.data.edges.update(edge);

                this.showEdgeInfo(edge);
            };
            this.modal.accept.style = "is-modifying";
            this.modal.showAdd = false;
            this.modal.showCancel = true;
            this.modal.icon = "pencil-fill";

            this.modal.fields = {
                label: edge.label
            }

            this.modal.active = true;
        },

        resetFilterData(nomatterwhat=false){
            if (nomatterwhat) this.graph.filter.nodes = {};

            for (var node of [...new Set(VM.graph.dataset.nodes.map((x) => x.tag))].sort()){
                if (nomatterwhat)
                    this.graph.filter.nodes[node] = true; 
                else {
                    if (!(node in this.graph.filter.nodes))
                    this.graph.filter.nodes[node] = true; 
                }
            }

            if (nomatterwhat) this.graph.filter.edges = {};

            for (var edge of [...new Set(VM.graph.dataset.edges.map((x) => x.label))].sort()){
                if (nomatterwhat)
                    this.graph.filter.edges[edge] = true; 
                else {
                    if (!(edge in this.graph.filter.edges))
                    this.graph.filter.edges[edge] = true; 
                }
            }
        },

        drawGraph(dataset, clean=false, firstDraw=false){
            // if we're re-drawing the graph,
            // let's first delete all previous data
            if (clean && this.graph.initialized){
                this.graph.data.nodes.clear();
                this.graph.data.edges.clear();
                this.graph.view.destroy();
            }

            // store dataset 
            this.graph.dataset = dataset;

            // set filter data
            if (clean && firstDraw){
                this.resetFilterData();
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

            // setup filter for nodes
            const nodeFilter = (node)=>{
                if (typeof this.graph.filter.nodes === 'object')
                    if (node.tag in this.graph.filter.nodes)
                        return this.graph.filter.nodes[node.tag];
                    else
                        return true;
                else
                    return this.graph.filter.nodes;
            }

            // setup filter for edges
            const edgeFilter = (edge)=>{
                if (typeof this.graph.filter.edges === 'object')
                    if (edge.label in this.graph.filter.edges)
                        return this.graph.filter.edges[edge.label];
                    else
                        return true;
                else
                    return this.graph.filter.edges;
            }

            this.graph.dataview = {
                nodes: new vis.DataView(nodes, { filter: nodeFilter }),
                edges: new vis.DataView(edges, { filter: edgeFilter })
            };

            this.graph.view = new vis.Network(container, this.graph.dataview, this.graph.config);

            const updateSelected = (x)=>{
                this.graph.selected.node = x.nodes.map((e) => this.graph.data.nodes.get(e));
                this.graph.selected.edge = x.edges.map((e) => this.graph.data.edges.get(e));
            }

            this.graph.view.on("selectNode", updateSelected);
            this.graph.view.on("deselectNode", updateSelected);
            this.graph.view.on("selectEdge", updateSelected);
            this.graph.view.on("deselectEdge", updateSelected);

            this.graph.view.on("doubleClick", (x)=>{
                this.expandNodeNeighbors(x.nodes[0]);
            });

            this.graph.view.on("hoverNode", (x)=>{
                this.graph.hovered.node = nodes.get(x.node);
                this.graph.hovered.edge = null;
            });

            this.graph.view.on("hoverEdge", (x)=>{
                this.graph.hovered.edge = edges.get(x.edge);
                this.graph.hovered.node = null;
            });

            this.graph.view.on("blurNode", ()=>{
                this.graph.hovered.node = null;
            });

            this.graph.view.on("blurEdge", ()=>{
                this.graph.hovered.edge = null;
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

        refreshGraph() {
            this.drawGraph(this.graph.dataset, clean=true);
        },

        updateGraphView() {
            console.log("Grafito:: updating graph view...");
        
            this.graph.config.interaction.hideNodesOnDrag = !this.config.graphView.showNodesOnDrag.value;
            this.graph.config.interaction.hideEdgesOnDrag = !this.config.graphView.showEdgesOnDrag.value;
            this.graph.config.interaction.hideEdgesOnZoom = !this.config.graphView.showEdgesOnZoom.value;
            
            this.graph.config.edges.font.size = (this.config.graphView.showEdgeLabels.value) ? 12 : 0;

            this.graph.view.setOptions(this.graph.config);
        },

        updateEngineSettings() {
            console.log("Grafito:: updating enging settings");

            $.post("/updateEngine", {
                caseSensitive: this.config.engine.caseSensitive.value 
            }, ()=>{
                console.log("Grafito:: done")
            });
        }
    },

    mounted(){
        console.log("Grafito:: App started");

        $.post("/startup", {}, (dd)=>{
            let obj = JSON.parse(dd);

            document.title = `Grafito @ ${obj.title}`;
            this.drawGraph(obj.data, clean=true, firstDraw=true);
            this.drawTable(obj.rows);
            this.config.versions = obj.versions;
            this.performInitialSetup = true;
            this.config.engine.caseSensitive.value = obj.caseSensitive;
            this.graph.initialized = true;
        });

        // window.onbeforeunload = ()=>{
        //     $.post( "/exit", {}, ()=>{});
        //     return true;
        // };
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
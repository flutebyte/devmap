

# def build_graph(data):

#     nodes = []
#     edges = []

#     root = data["title"]

#     nodes.append(Node(id=root, label=root, size=40))

#     for topic in data["topics"]:

#         nodes.append(Node(id=topic["name"], label=topic["name"], size=25))
#         edges.append(Edge(source=root, target=topic["name"]))

#         for sub in topic["subtopics"]:

#             nodes.append(Node(id=sub["name"], label=sub["name"], size=15))
#             edges.append(Edge(source=topic["name"], target=sub["name"]))

#     config = Config(width=900, height=600, directed=True, physics=True)

#     return agraph(nodes=nodes, edges=edges, config=config)
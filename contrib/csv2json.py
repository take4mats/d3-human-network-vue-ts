import csv
import sys
import json


def import_csv(filename=None):
    csv_file = open(filename, 'r', encoding='utf-8')
    dict = csv.DictReader(csv_file, delimiter=',',
                          doublequote=True,
                          lineterminator='\n',
                          quotechar='"',
                          skipinitialspace=True
                          )

    return list(dict)


# nodes にない source/target がいたら nodes に追加。 group はデフォルト値
def compensate_nodes(nodes, edges):
    node_names = list(map(lambda d: d['name'], nodes))
    for edge in edges:
        if edge['source'] not in node_names:
            node_names.append(edge['source'])
            nodes.append({'name': edge['source'], 'group': 'default'})
        if edge['target'] not in node_names:
            node_names.append(edge['target'])
            nodes.append({'name': edge['target'], 'group': 'default'})
    return nodes


def transform(nodes, edges):
    new_nodes = list(map(lambda d: {
        'name': str(d['name']),
        'group': str(d.get('group', 'default')),
    }, nodes))

    new_edges = list(map(lambda d: {
        'source': str(d['source']),
        'target': str(d['target']),
        'value': str(d['value']),
    }, edges))

    new_nodes = compensate_nodes(new_nodes, new_edges)
    new_data = {
        'nodes': new_nodes,
        'edges': new_edges
    }
    return new_data


def export_json(dict, output_json):
    with open(output_json, 'w', encoding='utf-8') as fp:
        json.dump(dict, fp, ensure_ascii=False)


'''
main
'''
if __name__ == '__main__':
    args = sys.argv
    nodes_csv = args[1]
    edges_csv = args[2]
    data_json = args[3]

    nodes = import_csv(nodes_csv)
    edges = import_csv(edges_csv)
    dict = transform(nodes, edges)
    export_json(dict, data_json)

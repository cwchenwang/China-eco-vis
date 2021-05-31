import pandas as pd
import numpy as np


def process(csv, name):
    df = pd.read_csv(csv, sep=',')
    cols = list(df.columns)

    out_dict = []
    for idx, row in df.iterrows():
        year = int(row['地区'][:4])
        for c in cols[:-1]:
            province = c
            # out_dict['year'].append(year)
            # out_dict['province'].append(province)
            # out_dict[name].append(row[c])
            out_dict.append((province, row[c], year))

    return out_dict

d1 = process('first.csv', 'first')
d2 = process('second.csv', 'second')
d3 = process('third.csv', 'third')


total = {}
def add_v(year, province, v):
    if province not in total: 
        total[province] = {}
    if year not in total[province]:
        total[province][year] = 0
    
    total[province][year] += v

for p, v, y in d1 + d2 + d3:
    add_v(y, p, v)

print(total)

years = list(range(2002, 2021))
pros = list(total.keys())

inall = []

for pro in pros:
    for year in years:
        values = [0, 0, 0]
        for (p, v, y) in d1:
            if p == pro and y == year:
                values[0] = v
                break
        for (p, v, y) in d2:
            if p == pro and y == year:
                values[1] = v
                break
        for (p, v, y) in d3:
            if p == pro and y == year:
                values[2] = v
                break
        total = values[0] + values[1] + values[2]
        inall.append((pro, year, values[0], values[1], values[2], total))

dic = {
    'province':[], 
    'year': [],
    'first': [],
    'second': [],
    'third': [],
    'total': [],
    }

for p, y, v1, v2, v3, t, in inall:
    dic['province'].append(p)
    dic['year'].append(y)
    dic['first'].append(v1)
    dic['second'].append(v2)
    dic['third'].append(v3)
    dic['total'].append(t)

newdf = pd.DataFrame(dic)

newdf.to_csv('all.csv', float_format='%.1f', index=False)


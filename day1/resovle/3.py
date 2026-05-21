text = input("Nhập chuỗi: ")
text = text.lower()
max = text[0]
for i in text:
    if text.count(i) > text.count(max):
        max = i
print(max)

#thhuong
#max = h

text = input("Nhập chuỗi: ")

words = text.split()

for i in range(len(words)):
    words[i] = words[i][0].upper() + words[i][1:] 
    #tHUong = THUong


result = " ".join(words)

print(result)
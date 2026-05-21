string = input("Nhập chuỗi: ").lower()
count = {}
for char in string:
    if char != " ":
        if char in count:
            count[char] += 1
        else:
            count[char] = 1
print(count)

#le minh hoai thuong
#count = {'l': 1, 'e': 1, 'm': 1, 'i': 2, 'n': 2, 'h': 3, 'o': 2, 'a': 1, 'u': 1,'g': 1}
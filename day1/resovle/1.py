full_name = input("Nhập họ tên: ")
word = full_name.split() 

for i in range(len(word)):
    word[i] = word[i].capitalize()

full_name = " ".join(word)
print(full_name) 
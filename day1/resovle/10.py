num = int(input("Nhập số có 3 chữ số: "))

so = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]

a = num // 100
b = (num % 100) // 10
c = num % 10
#123
result = so[a] + " trăm "
# a =1,b = 2, c = 3
if b == 0 and c != 0:
    result += "lẻ " + so[c]
#b = 2, c=3
elif b == 1:
    result += "mười "
    
    if c == 5:
        result += "lăm"
    elif c != 0:
        result += so[c]

elif b > 1:
    result += so[b] + " mươi "
    
    if c == 1:
        result += "mốt"
    elif c == 5:
        result += "lăm"
    elif c != 0:
        result += so[c]

print(result)
def tach_ten(full_name):
    words = full_name.split()

    ten = words[-1]
    ho_lot = " ".join(words[:-1])

    return ho_lot, ten


name = input("Nhập họ tên: ")

ho_lot, ten = tach_ten(name)

print("Họ lót:", ho_lot)
print("Tên:", ten)
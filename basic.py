def fractran(program_str):
    # Parse "3/2, 1/3" → [(3,2), (1,3)]
    fractions = []
    for part in program_str.split(','):
        part = part.strip()
        if '/' in part:
            num, den = map(int, part.split('/'))
            if num > 0 and den > 0:
                fractions.append((num, den))

    result = []
    n = 2

    MAX_STEPS = 10000

    for _ in range(MAX_STEPS):
        if len(result) >= 10:
            break
        result.append(n)

        updated = False
        for num, den in fractions:
            if n % den == 0:
                n = (n // den) * num
                updated = True
                break

        if not updated:
            break

    return result


# Tests
print(fractran("3/2, 1/3"))                     # [2, 3, 1]
print(fractran("3/2, 5/3, 1/5"))                # [2, 3, 5, 1]
print(fractran("3/2, 6/3"))                     # [2, 3, 6, 9, 18, 27, 54, 81, 162, 243]
print(fractran("2/7, 7/2"))                     # [2, 7, 2, 7, 2, 7, 2, 7, 2, 7]
print(fractran("17/91, 78/85, 19/51, 23/38, 29/33, 77/29, 95/23, 77/19, 1/17, 11/13, 13/11, 15/14, 15/2, 55/1"))
# → [2, 15, 825, 725, 1925, 2275, 425, 390, 330, 290]

def filter_books(queryset, query_params):
    title = query_params.get("title")
    author = query_params.get("author")
    price = query_params.get("price")
    quantity = query_params.get("quantity")

    if title:
        queryset = queryset.filter(title__icontains=title)

    if author:
        queryset = queryset.filter(author__icontains=author)

    if price:
        queryset = queryset.filter(price=price)

    if quantity:
        queryset = queryset.filter(quantity=quantity)

    return queryset

food_file = open("food price FINAL(food price FINAL).csv", 'r')
food_list = []
for food in food_file:
    current_food = food.strip().split(",")
    food_list.append(current_food)

carbon_list = []
receipt = ["Tomatoes", "Potatoes", "Shrimp"]
for camera_food in receipt:
    for i in range(len(food_list)):
        if food_list[i][0] == camera_food:
            food_carbon = [food_list[i][0], food_list[i][2]]
            carbon_list.append(food_carbon)
print(carbon_list)
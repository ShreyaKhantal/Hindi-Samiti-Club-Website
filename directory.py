# import os

# def print_directory_structure(root_dir, indent=""):
#     items = os.listdir(root_dir)
#     for index, item in enumerate(sorted(items)):
#         path = os.path.join(root_dir, item)
#         is_last = index == len(items) - 1
#         branch = "└── " if is_last else "├── "
#         print(indent + branch + item)
#         if os.path.isdir(path):
#             extension = "    " if is_last else "│   "
#             print_directory_structure(path, indent + extension)

# # Replace with your folder path
# folder_path = "F:/Hindi Samiti/hindi_samiti"
# print(folder_path)
# print_directory_structure(folder_path)

import os

def print_directory_structure(root_dir, indent=""):
    try:
        items = os.listdir(root_dir)
    except PermissionError:
        return  # Skip folders without permission

    for index, item in enumerate(sorted(items)):
        if item == "node_modules" or '.git':
            continue  # Skip node_modules folder

        path = os.path.join(root_dir, item)
        is_last = index == len(items) - 1
        branch = "└── " if is_last else "├── "
        print(indent + branch + item)

        if os.path.isdir(path):
            extension = "    " if is_last else "│   "
            print_directory_structure(path, indent + extension)

# Replace with your folder path
folder_path = "F:/Hindi Samiti/hindi_samiti"
print(folder_path)
print_directory_structure(folder_path)

from setuptools import setup, find_packages

setup(
    name="librarian",
    version='0.1.0dev',
    author='German Saturday School Boston',
    author_email='librarygssb@gmail.com',
    description="GSSB Library System",
    keywords = "library",
    classifiers = [
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Flask',
        'Intended Audience :: Customer Service',
        'License :: OSI Approved :: BSD License',
        'Programming Language :: Python',
        'Natural Language :: English',
        'Operating System :: OS Independent'],
    url='http://github.com/gssblib/schedule',
    license='BSD',
    packages=find_packages('src'),
    package_dir = {'': 'src'},
    install_requires=[
        'Flask',
        'Flask-MySQL',
        'requests',
        'setuptools',
        ],
    entry_points = dict(console_scripts=[
        'run = librarian.app:main',
        ]),
    include_package_data = True,
    zip_safe = False,
)

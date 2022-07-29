# Example Unit Test in NestJS

### specification
<ul>
    <li>Nodejs: v18.6.0
    <li>npm: 8.13.2
    <li>mysql: 8.0.27
</ul>

### Use Case
- Members can borrow books with conditions
    - [X]  Members may not borrow more than 2 books
    - [X]  Borrowed books are not borrowed by other members
    - [X]  Member is currently not being penalized
- Member returns the book with conditions
    - [X]  The returned book is a book that the member has borrowed
    - [X]  If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days
- Check the book
    - [X]  Shows all existing books and quantities
    - [X]  Books that are being borrowed are not counted
- Member check
    - [X]  Shows all existing members
    - [X]  The number of books being borrowed by each member

### Endpoint
GET   ${HOST_NAME}/swagger                                    => API Documentation
GET   ${HOST_NAME}/members                                    => to fetch all members
GET   ${HOST_NAME}/members/:code                              => to fetch member with spcific member-code
GET   ${HOST_NAME}/books                                      => to fetch all books
GET   ${HOST_NAME}/book/:code                                 => to fetch book with spcific book-code
GET   ${HOST_NAME}/members                                    => to fetch all members
GET   ${HOST_NAME}/members/:code                              => to fetch member with spcific member-code
POST  ${HOST_NAME}/members/:memberCode/borrow/:bookCode       => borrow a book operation
POST  ${HOST_NAME}/members/:memberCode/return/:bookCode       => return a book operation
### Running
<h6><i>install dependency</i></h6>
<code>npm install</code>

<h6><i>running test</i></h6>
<code>npm run test</code>

<h6><i>running app</i></h6>
<code>npm run start</code>
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    
    const testUserOne = {
      name: 'test1',
      username: 'userone',
      password: 'testone'
    };

    const testUserTwo = {
      name: 'test2',
      username: 'usertwo',
      password: 'testtwo'
    };

    cy.request('POST', 'http://localhost:3003/api/users/', testUserOne);
    cy.request('POST', 'http://localhost:3003/api/users/', testUserTwo);
    cy.visit('http://localhost:5173');
  });

  it('Login form is shown', function() {
    cy.get('#username').should('exist');
    cy.get('#password').should('exist');
    cy.get('#login-button').should('exist');
  });

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('userone');
      cy.get('#password').type('testone');
      cy.get('#login-button').click();

    });

    it('fails with wrong credentials and shows red notification', function() {
      cy.get('#username').type('usertwo');
      cy.get('#password').type('incorrectpassword');
      cy.get('#login-button').click();

      cy.contains('Wrong username or password').should('exist').and('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });
  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('userone');
      cy.get('#password').type('testone');
      cy.get('#login-button').click();
    });

    it('A blog can be created and users can like a blog', function() {
      cy.contains('Create New Blog').click();
      cy.get('form  input[name="title"]').type('E2E Testing');
      cy.get('form input[name="author"]').type('Test Author Jay');
      cy.get('form input[name="url"]').type('http://testauthorurl.com');
      cy.contains('Create Blog').click({ force: true })

      cy.contains('E2E Testing').should('exist');
      cy.contains('Test Author Jay').should('exist');
     
      cy.contains('View').click();
      cy.contains('Like').click();
      cy.contains('Likes: 1').should('exist');
      cy.contains('Remove').click();
   
      cy.contains('E2E Testing').should('not.exist');
      cy.contains('Test Author Jay').should('not.exist');
    });
    it('only user who created the blog can delete it', function () {
      cy.contains('Create New Blog').click();
      cy.get('form  input[name="title"]').type('E2E Testing 2');
      cy.get('form input[name="author"]').type('Test Author Jay 2');
      cy.get('form input[name="url"]').type('http://testauthorurl2.com');
      cy.contains('Create Blog').click({ force: true })
      cy.contains('E2E Testing 2').should('exist');
      cy.contains('Test Author Jay 2').should('exist');
      cy.contains('View').click()
      cy.contains('Remove').click();

      cy.contains('logout').click()
      cy.get('#username').type('userone')
      cy.get('#password').type('testone')
      cy.get('#login-button').click()
      
      cy.contains('Remove').should('not.exist')
    
    })
  });
  describe('Checking if are ordered by likes', function() {
    beforeEach(function() {
      
      cy.request('POST', 'http://localhost:3003/api/testing/reset');
      const testUserOne = {
        name: 'test1',
        username: 'userone',
        password: 'testone'
      };
      cy.request('POST', 'http://localhost:3003/api/users/', testUserOne);
  
    
      cy.visit('http://localhost:5173');
      cy.get('#username').type('userone');
      cy.get('#password').type('testone');
      cy.get('#login-button').click();
    });
  
    it('Blogs are ordered according to likes', function() {
    
      cy.contains('Create New Blog').click();
      cy.get('form input[name="title"]').type('The title with the most likes');
      cy.get('form input[name="author"]').type('Test Author Jay 1');
      cy.get('form input[name="url"]').type('http://testauthorurl1.com');
      cy.contains('Create Blog').click({ force: true });
      cy.contains('The title with the most likes').should('exist');
      cy.contains('Test Author Jay 1').should('exist');
  
      cy.contains('Create New Blog').click();
      cy.get('form input[name="title"]').type('The title with second most likes');
      cy.get('form input[name="author"]').type('Test Author Jay 2');
      cy.get('form input[name="url"]').type('http://testauthorurl2.com');
      cy.contains('Create Blog').click({ force: true });
      cy.contains('The title with second most likes').should('exist');
      cy.contains('Test Author Jay 2').should('exist');

      cy.contains('Create New Blog').click();
      cy.get('form input[name="title"]').type('The title with third most likes');
      cy.get('form input[name="author"]').type('Test Author Jay 3');
      cy.get('form input[name="url"]').type('http://testauthorurl3.com');
      cy.contains('Create Blog').click({ force: true });
      cy.contains('The title with third most likes').should('exist');
      cy.contains('Test Author Jay 3').should('exist');
      cy.wait(1000);

      cy.contains('The title with third most likes').parent().parent().as('thirdBlog');
      cy.get('@thirdBlog').contains('View').click();
      cy.get('@thirdBlog').contains('Like').click();
  
      cy.wait(1000);

      cy.visit('http://localhost:5173');
  
      cy.get('.blog').eq(0).contains('The title with the most likes');
      cy.get('.blog').eq(1).contains('The title with second most likes');
      cy.get('.blog').eq(2).contains('The title with third most likes');
    });
  });
  
});

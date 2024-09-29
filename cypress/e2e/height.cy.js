beforeEach(() => {
    cy.resetDatabase();
    cy.loginUser();
    cy.visitNewPageEditor();
    cy.addBlock('kevinbatdorf/code-block-pro');
    cy.getPostContent('.wp-block[class*="code-block-pro"]').should('exist');

    cy.focusBlock('code-block-pro', 'textarea');
    cy.get('.wp-block[class*="code-block-pro"] textarea').should('have.focus');
});
afterEach(() => {
    cy.saveDraft(); // so we can leave without an alert
    cy.logoutUser();
});
context('Max Height', () => {
    it('Some footers can expand height', () => {
        cy.setHeader('none');
        cy.setFooter('none');
        cy.getPostContent('.wp-block[class*="code-block-pro"]')
            .invoke('html')
            .should('not.contain', 'Expand');
        cy.enableMaxHeight();
        cy.setHeightDesign('roundCenter');
        cy.getPostContent('.wp-block[class*="code-block-pro"]')
            .invoke('html')
            .should('contain', 'Expand');

        cy.openSideBarPanel('Max Height');
        cy.get('[data-cy="see-more-text"]')
            .should('exist')
            .should('have.value', '')
            .type('foo-bar-baz-lets-go');

        cy.getPostContent('.wp-block[class*="code-block-pro"]')
            .invoke('html')
            .should('contain', 'foo-bar-baz-lets-go')
            .should('not.contain', 'Expand');

        cy.addCode(
            'const foo = "1";\nconst foo = "2";\nconst foo = "3";\nconst foo = "4";\nconst foo = "5";',
        );

        cy.previewCurrentPage();

        cy.get('.wp-block-kevinbatdorf-code-block-pro').should(
            'contain',
            'foo = "5"',
        );

        cy.go('back');

        cy.focusBlock('code-block-pro', 'textarea');
        cy.get('.wp-block[class*="code-block-pro"] textarea').should(
            'have.focus',
        );
        cy.openSideBarPanel('Max Height');
        cy.get('[data-cy="see-more-line"]')
            .should('exist')
            .should('have.value', '')
            .type('3');

        cy.previewCurrentPage();

        cy.contains('foo = "5"').should('not.be.visible');

        cy.get('.cbp-see-more-simple-btn').click();

        cy.contains('foo = "5"').should('be.visible');

        cy.get('.cbp-see-more-simple-btn').should('not.exist');
    });

    it('Calculates the height with headers and footers', () => {
        cy.setHeader('headlights');
        cy.setFooter('simpleStringEnd');

        cy.addCode(
            'const foo = "1";\nconst foo = "2";\nconst foo = "3";\nconst foo = "4";\nconst foo = "5";',
        );

        cy.enableMaxHeight();
        cy.setHeightDesign('blockLeft');

        cy.previewCurrentPage();

        cy.get('.wp-block-kevinbatdorf-code-block-pro').should(
            'contain',
            'foo = "5"',
        );

        cy.go('back');
        cy.focusBlock('code-block-pro', 'textarea');
        cy.get('.wp-block[class*="code-block-pro"] textarea').should(
            'have.focus',
        );

        cy.openSideBarPanel('Max Height');
        cy.get('[data-cy="see-more-line"]')
            .should('exist')
            .should('have.value', '')
            .type('3');

        cy.previewCurrentPage();

        cy.contains('foo = "5"').should('not.be.visible');
        cy.get('.cbp-see-more-simple-btn').click();
        cy.contains('foo = "5"').should('be.visible');
        cy.get('.cbp-see-more-simple-btn').should('not.exist');

        cy.go('back');
        cy.focusBlock('code-block-pro', 'textarea');
        cy.get('.wp-block[class*="code-block-pro"] textarea').should(
            'have.focus',
        );
        cy.openSideBarPanel('Max Height');
        cy.setHeader('headlights');
        cy.setHeightDesign('none');

        cy.previewCurrentPage();

        cy.contains('foo = "5"').should('not.be.visible');
        cy.get('.cbp-see-more-simple-btn').should('not.exist');
    });

    it('Can set max height in the editor', () => {
        cy.addCode(
            'const foo = "1";\nconst foo = "2";\nconst foo = "3";\nconst foo = "4";\nconst foo = "5";',
        );
        // pre height should be over 80px
        cy.get('.wp-block[class*="code-block-pro"] > div')
            .invoke('height')
            .should('be.gt', 80);
        cy.openSideBarPanel('Max Height');
        cy.get('[data-cy-cbp="editor-height"]').should('exist').type('70');
        cy.get('.wp-block[class*="code-block-pro"] > div')
            .invoke('height')
            .should('be.lt', 80);
    });
});

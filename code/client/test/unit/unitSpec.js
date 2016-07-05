describe('Test Unit for crossoverApp', function(){

  beforeEach(module('crossoverApp'));

  describe("Login Controller Unit Testing", function () {
    var ctrl, scope, httpBackend;
    // Set up the module
    beforeEach(inject(function($controller, $rootScope, _$httpBackend_) {
      scope = $rootScope.$new();
      ctrl = $controller('LoginControler', {$scope:scope});
      httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('should login successfully', function() {
      httpBackend.flush();
      var data = {
        username: "ali",
        password: "password"
      }
      httpBackend.whenPost('/user/auth', data).respond(200, '');
      scope.login('ali', 'password', 'true');
      expect(scope.data.status).toBe('success');
      expect(scope.data.sessionId).toBeDefined();
      expect(scope.data.username).toBe("ali");
      httpBackend.flush();
      expect(scope.status).toBe('');
    });

  });

});